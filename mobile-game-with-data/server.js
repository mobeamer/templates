var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var GameEngine = require("./public/js/engine/game-engine.class.js");
var GameEntity = require("./public/js/engine/game-entity.class.js");
var Position = require("./public/js/engine/position.class.js");
var DataPacket = require("./public/js/engine/data-packet.class.js");
var config = require("./public/js/games/data-driven-game.config.json");
var play = require("./public/js/games/data-driven-game-server.js");
//var config = require("./public/js/games/fight-test-game.config.json");

var options = {logging:true}
var debugTicks = false;

var entities = new Array();
var users = new Array();

var gameEngine = new GameEngine({runningOnServer:true});
gameEngine.init({runningOnServer:true});

setupGame();

var numUsers = 0;
var port = 3000;


app.use(express.static('public'));


io.on('connection', function(socket){ 
    
  numUsers++;
  console.log('User Connected: ' + numUsers);

  socket.on('disconnect', function(){
      console.log('User Disconnected');
      numUsers--;
    });


  socket.on('join-server', function(dataPacket)
  {
      console.log("----------------------------------------------------------------");
      console.log("server:join-server: User joining: " + dataPacket.userGuid + " SOCKET:" + socket.id);
      
      var userIdx = getUserIdx(dataPacket.userGuid);
      console.log("userIdx:" + userIdx);
      var user = "";

      if(userIdx < 0)
      {
        user = {userID: users.length+1, userGuid:dataPacket.userGuid, socketID: socket.id, gold:0, score:0};
        users.push(user);
      }
      else
      {
        user = users[userIdx];
      }


      var numUnits = gameEngine.numEntitiesByUserID(user.userID);
      
      console.log(gameEngine.getTxtReport('entity-list'));

      console.log(getTxtReport('user-list'));

      if(numUnits <= 0)
      {
        for(var i=0;i<10;i++)
        {
          var x = config.startingChar.startX + (i *40);
          var y = config.startingChar.startY;

          if(gameEngine.isEmptySpot(x,y, 32, 32))
          {
            gameEngine.addEntity(new GameEntity({
                      entityID: gameEngine.entity.length+1
                      ,ownerID: user.userID
                      ,pos: new Position({x:x,y:y})
                      ,width: 32
                      ,height: 32 
                      ,speed: 1
                      ,velX: 0
                      ,velY:0
                      ,life: config.startingChar.life
                      ,runningOnServer: true
                    }));
            i = 99;
            
            console.log("Entity Added - " + gameEngine.entity.length);
          }
          else
          {
            console.log("No empty space at " + x + "," + y + " search " + i);
          }

          
        }
      }

      sendMsgs('user-has-joined', [new DataPacket("user-has-joined", {user:user})]);

      
     
      sendUpdateToAll();
    });


  socket.on('get-game-map-data', function(dataPacket)
  {
      console.log("----------------------------------------------------------------");
      console.log("server:get-game-map-data");
      
      //console.log(gameEngine.getGameMapData());

      sendMsgs('game-map-data', [new DataPacket("game-map-data", {tiles:gameEngine.getGameMapData()})]);
  
  });


  socket.on('get-user-data', function(dataPacket)
  {
      console.log("----------------------------------------------------------------");
      console.log("server:get-user-data");
      
   
      var userIdx = getUserIdx(dataPacket.userGuid);
      var socketID = users[userIdx].socketID;
      
      io.to(socketID).emit("user-data", users[userIdx]);
        
  });


  


  socket.on('get-config', function(dataPacket)
  {
      console.log("----------------------------------------------------------------");
      console.log("server:get-config");
      
      var out = new DataPacket("game-config", {"config": config});
      
      sendMsgs('game-config', [out]);
        
  });

  
  socket.on('set-dest', function(dataPacket)
  {
      console.log("----------------------------------------------------------------");
      console.log("server:set-dest");
      
      for(var i=0;i<gameEngine.entity.length;i++)
      {
        if(gameEngine.entity[i].entityID == dataPacket.entityID)
        {
          gameEngine.entity[i].setDest(dataPacket.destX, dataPacket.destY);
          gameEngine.entity[i].stopAttacking(gameEngine);
        }
      }
     
      sendUpdateToAll();
        
  });


  socket.on('attack', function(dataPacket)
  {
      console.log("----------------------------------------------------------------");
      console.log("server:fight");
      
      var attackerEntityID = dataPacket.attackingEntityID;
      var defenderEntityID = dataPacket.defendingEntityID;
      var attackerIdx = gameEngine.getEntityIdxFromID(attackerEntityID);
      var defenderIdx = gameEngine.getEntityIdxFromID(defenderEntityID);

      if(defenderIdx !== undefined && attackerIdx !== undefined)
      {
        gameEngine.entity[attackerIdx].stopAttacking(gameEngine);
        gameEngine.entity[attackerIdx].setTargetEnemyIdx(defenderIdx);
        console.log("Fighting EntityID: " + attackerEntityID + " vs " + defenderEntityID);
        
        var userIdx = getUserIdxByID(gameEngine.entity[attackerIdx].ownerID);
        users[userIdx].score++;
      }

      //sendUpdateToAll();
        
  })


});




http.listen(port, function(){
  console.log('listening on *:' + port);
});

function sendUpdateToAll() 
{
  sendMsgs('game-entities', [new DataPacket("game-entities", {gameEntities:gameEngine.getEntityStates()})]);
}

function sendMsgs(msgGroup, msgs)
{
    for(var i=0;i<msgs.length;i++)
    {
      //console.log("...sending" , msgs[i]);
      io.emit(msgGroup, msgs[i]);
    }

}



function spawnEnemies(spawnNum)
{
  for(var i=0;i<spawnNum;i++)
  {
      var profileIdx = gameEngine.getRandomNumber(0, config.enemyProfiles.length-1);
      console.log("profileIdx:" + profileIdx);

      var x = gameEngine.getRandomNumber(10, 1000);
      var y = gameEngine.getRandomNumber(10, 1000);
      var life = config.enemyProfiles[profileIdx].life;
      var level = config.enemyProfiles[profileIdx].level;
      
      gameEngine.addEntity(new GameEntity({
        entityID: gameEngine.entity.length+1
        ,ownerID: -1
        ,pos: new Position({x:x,y:y})
        ,width: 32
        ,height: 32 
        ,speed: 1
        ,velX: 0
        ,velY:0
        ,life: life
        ,level: level
        ,runningOnServer: true
      })
    );  

    console.log("Creating enemy at " + x + "," + y + " life:" + life + " level:" + level);
  }
}

function getTileMap(tileMapName)
{
  for(var i=0;i<config.tileMaps.length;i++)
  {
    if(config.tileMaps[i].tileMapName == tileMapName)
    {
      return config.tileMaps[i];
    }
  };

  return -1;
}

function setupGame()
{
  spawnEnemies(config.numEnemies);

  for(var i=0;i<config.build.length;i++)
  {
    var build = config.build[i];

    if(build.buildType == "tileMap")
    {
      var tileMap = getTileMap(build.tileMapName);

      gameEngine.loadTileMapAt(build.x, build.y, tileMap.tileSize, tileMap.assetKey,tileMap.tileMap, tileMap.isWalkable);
      
      console.log("Built " + build.tileMapName + " at " + build.x + "," + build.y);
    }

    if(build.buildType == "random")
    {
      
      for(var i=0;i<build.numDirt;i++)
      {
          var x = gameEngine.getRandomNumber(build.minX,build.maxX);
          var y = gameEngine.getRandomNumber(build.minY, build.maxY);
          addSmallDirtPile(x,y);
      }

      for(var i=0;i<build.numLava;i++)
      {
          var x = gameEngine.getRandomNumber(build.minX,build.maxX);
          var y = gameEngine.getRandomNumber(build.minY, build.maxY);
          addSmallLavaLake(x,y);
      }

    }
  }

  console.log(gameEngine.tiles[0]);
}


var tickLengthMs = 1000 / 60;
var previousTick = Date.now()
var actualTicks = 0
var loopTick = 0;

var gameLoop = function () {
  var now = Date.now()

  actualTicks++
  if (previousTick + tickLengthMs <= now) {
    var delta = (now - previousTick) / 1000
    previousTick = now

    gameUpdate(delta)

    //console.log('delta', delta, '(target: ' + tickLengthMs +' ms)', 'node ticks', actualTicks)
    actualTicks = 0
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(gameLoop)
  } else {
    setImmediate(gameLoop)
  }
}



var gameUpdate = function(delta) 
{
  loopTick++;
  var watchIdx = 2;

  if(loopTick % 60 == 0) 
  {
    if(debugTicks) 
    {
      console.log("Tick: " + loopTick);
    
      if(gameEngine.entity.length > watchIdx)
      {
        console.log("EntityIdx: " + watchIdx + ": " + gameEngine.entity[watchIdx].pos.x + "," + gameEngine.entity[watchIdx].pos.y);
      }
    }
    sendUpdateToAll();
  }
    
  gameEngine.update();

  var numEnemies = 0;
  for(var i=0;i<gameEngine.entity.length;i++)
  {
    if(gameEngine.entity[i].ownerID < 0 && gameEngine.entity[i].isAlive())
    {
      numEnemies++;
    }
  }

  if(numEnemies < config.numEnemies)
  {
    spawnEnemies(config.numEnemies - numEnemies);
  }
}



gameLoop()  //start it up...

function getTxtReport(rptKey)
{
  var out = "";

  if(rptKey == "user-list")
  {
      var out = "";

      for(var i=0;i<users.length;i++)
      {
          out+= "UserID:" + users[i].userID + " UserGuid:" + users[i].userGuid + "\r\n";
      }
  }

  return out;
}



function getUserIdxByID(userID)
{
  for(var i=0;i<users.length;i++)
  {
    if(users[i].userID == userID)
    {
      return i;
    }
      
  }

      return -1;
}


function getUserIdx(userGuid)
{
  for(var i=0;i<users.length;i++)
  {
    if(users[i].userGuid == userGuid)
    {
      return i;
    }
      
  }

      return -1;
}



function addSmallDirtPile(x, y)
{
    
    var tileMap = [
        [6,9 ,9 ,9 ,12 ]
       ,[7,10,10,10,13]
       ,[7,10,10,10,13]
       ,[7,10,10,10,13]
       ,[8,11,11,11,14 ]
    ];

    gameEngine.loadTileMapAt(x, y, 32,'dirt-tile-sheet',tileMap, true);

}

function addSmallLavaLake(x, y)
{
    
    var tileMap = [
        [6,9 ,9 ,9 ,12 ]
       ,[7,10,10,10,13]
       ,[7,10,10,10,13]
       ,[7,10,10,10,13]
       ,[8,11,11,11,14 ]
    ];

    gameEngine.loadTileMapAt(x, y, 32,'lava-tile-sheet',tileMap, false);

}
