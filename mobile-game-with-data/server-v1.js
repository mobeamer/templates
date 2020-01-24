var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GameEngine = require("./public/js/engine/game-engine.class.js");
var GameEntity = require("./public/js/engine/game-entity.class.js");
var Position = require("./public/js/engine/position.class.js");
var DataPacket = require("./public/js/engine/data-packet.class.js");


var options = {logging:true}

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
      console.log("server:join-server: User joining: " + dataPacket.userGuid);
      
      var userIdx = getUserIdx(dataPacket.userGuid);
      console.log("userIdx:" + userIdx);
      if(userIdx < 0)
      {
        var user = {userID: users.length+1, userGuid:dataPacket.userGuid};
        users.push(user);

        var numUnits = gameEngine.numEntitiesByUserID(user.userID);
        
        console.log(gameEngine.getTxtReport('entity-list'));

        console.log(getTxtReport('user-list'));

        if(numUnits <= 0)
        {
          gameEngine.addEntity(new GameEntity({
                    entityID: gameEngine.entity.length+1
                    ,ownerID: user.userID
                    ,pos: new Position({x:100,y:100})
                    ,width: 32
                    ,height: 32 
                    ,speed: 1
                    ,velX: 0
                    ,velY:0
                    ,life: 100
                    ,runningOnServer: true
                  })
          );

          console.log("Entity Added - " + gameEngine.entity.length);
        }

        sendMsgs('user-has-joined', [new DataPacket("user-has-joined", {user:user})]);
      }
      else
      {
        sendMsgs('user-has-joined', [new DataPacket("user-has-joined", {user:users[userIdx]})]);
      }
        

      
     
      sendUpdateToAll();
        
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
        gameEngine.entity[attackerIdx].setTargetEnemyIdx(defenderIdx);
        console.log("Fighting EntityID: " + attackerEntityID + " vs " + defenderEntityID);
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






function setupGame()
{
        gameEngine.addEntity(new GameEntity({
          entityID: gameEngine.entity.length+1
          ,ownerID: -1
          ,pos: new Position({x:100,y:200})
          ,width: 32
          ,height: 32 
          ,speed: 1
          ,velX: 0
          ,velY:0
          ,runningOnServer: true
        })
      );  


      gameEngine.addEntity(new GameEntity({
        entityID: gameEngine.entity.length+1
        ,ownerID: -1
        ,pos: new Position({x:50,y:300})
        ,width: 32
        ,height: 32 
        ,speed: 1
        ,velX: 0
        ,velY:0
        ,runningOnServer: true
      })
      );  



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
    console.log("Tick: " + loopTick);
    if(gameEngine.entity.length > watchIdx)
    {
      console.log("EntityIdx: " + watchIdx + ": " + gameEngine.entity[watchIdx].pos.x + "," + gameEngine.entity[watchIdx].pos.y);
    }
    sendUpdateToAll();
  }
  gameEngine.update();
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
