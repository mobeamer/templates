function Game(options)
{
    this.debugNameSpace = "SampleGame()";
    this.gameObjs = [];
    this.tileSize = 64;
    this.selectedGameObjectIdx = -1;
    this.currentAction = {};
    this.mapID = -1;
    this.playing = true;
    this.refreshRate = 2000;

    this.joinedServer = function()
    {
        //called immediatly after user has authenticated
        console.log(this.debugNameSpace + ": joinedServer()");
        gui.showView("viewEntrance");

        this.loadGame();     //dont need to call this...but am
    }

    this.loadGame = function()
    {
        gameEngine = new GameEngine({canvasID: "mainGameCanvas"});
        gameEngine.init({canvasID: "mainGameCanvas"});
        gameEngine.startRendering();

        gui.showView("viewGameCanvas");


        //this.loadWalkingSamples();

        //this.loadControllerSample();

        //this.loadCollisionSample();

        //this.loadWayPointsSample();

        //this.loadTileMap();

        //this.loadCollisionSample2();

    }

    
    this.loadCollisionSample2 = function()
    {
        assets.addAsset({key: 'dirt-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/dirt.png'});
        assets.addAsset({key: 'lava-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/lava.png'});
        
        
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: user.userID
                            ,pos: new Position({x:100,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));
        gameEngine.entity[0].setDest(100,200);  


        var tileMap = [
                     [6,9 ,9 ,9 ,12 ]
                    ,[7,10,10,10,13]
                    ,[7,10,10,10,13]
                    ,[7,10,10,10,13]
                    ,[8,11,11,11,14 ]
        ];
        gameEngine.loadTileMapAt(10,150, 32,'dirt-tile-sheet',tileMap, true);

        gameEngine.loadTileMapAt(250,150, 32,'lava-tile-sheet',tileMap, false);
    }


    this.loadTileMap = function()
    {
            assets.addAsset({key: 'dirt-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/dirt.png'});

        
            var tileMap = [
                     [6,9 ,9 ,9 ,12 ]
                    ,[7,10,10,10,13]
                    ,[7,10,10,10,13]
                    ,[7,10,10,10,13]
                    ,[8,11,11,11,14 ]
            ];
            gameEngine.loadTileMapAt(10,10, 32,'dirt-tile-sheet',tileMap);
            
            var tileMap = [
                [6,9 ,9 ,9 ,12 ]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[7,10,10,10,13]
               ,[8,11,11,11,14 ]
            ];


            gameEngine.loadTileMapAt(10,250, 32,'dirt-tile-sheet',tileMap);

            
    }


    this.loadWayPointsSample = function()
    {
        gameEngine.addEntity(new GameEntity({
            entityID: 1
            ,ownerID: 1
            ,pos: new Position({x:100,y:100})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
        }));

        gameEngine.entity[0].addWayPoint({x:100,y:200}); 
        gameEngine.entity[0].addWayPoint({x:250,y:250}); 
    }

    this.loadCollisionSample = function()
    {
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: 1
                            ,pos: new Position({x:100,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));
        gameEngine.entity[0].setDest(100,200);  

        //east to west <-------------
        gameEngine.addEntity(new GameEntity({
            entityID: 2
            ,ownerID: 1
            ,pos: new Position({x:200,y:160})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
        }));
        gameEngine.entity[1].setDest(10,160);  

        //west to east ------------->
        gameEngine.addEntity(new GameEntity({
            entityID: 3
            ,ownerID: 1
            ,pos: new Position({x:10,y:160})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
        }));
        gameEngine.entity[2].setDest(200,160);  

        //moving north
        gameEngine.addEntity(new GameEntity({
            entityID: 4
            ,ownerID: 1
            ,pos: new Position({x:100,y:250})
            ,width: 32
            ,height: 32
            ,speed: 1 
            ,velX: 0
            ,velY: 0
        }));
        gameEngine.entity[3].setDest(100,10);  

        //controlling
        gameEngine.addEntity(new GameEntity({
                            entityID: 99
                            ,ownerID: user.userID
                            ,pos: new Position({x:100,y:160})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));  

                      
    }


    this.loadControllerSample = function()
    {
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: 1
                            ,pos: new Position({x:100,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));
                        
        //controlling
        gameEngine.addEntity(new GameEntity({
                            entityID: 2
                            ,ownerID: user.userID
                            ,pos: new Position({x:150,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));  
                        
        gameEngine.addEntity(new GameEntity({
                            entityID: 3
                            ,ownerID: user.userID
                            ,pos: new Position({x:200,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: 0
                        }));  

    }

    this.loadWalkingSamples = function()
    {
        //walking north
        gameEngine.addEntity(new GameEntity({
                            entityID: 1
                            ,ownerID: 1
                            ,pos: new Position({x:10,y:100})
                            ,width: 32
                            ,height: 32
                            ,speed: 1 
                            ,velX: 0
                            ,velY: -.1
                        }));
        gameEngine.entity[0].setDest(10,10);

        //walking south
        gameEngine.addEntity(new GameEntity({
                            entityID: 2
                            ,ownerID: 1
                            ,pos: new Position({x:50,y:10})
                            ,width: 32
                            ,height: 32 
                            ,speed: 2
                            ,velX: 0
                            ,velY: .1
                        }));                        
        gameEngine.entity[1].setDest(50,100);

        //walking east
        gameEngine.addEntity(new GameEntity({
            entityID: 3
            ,ownerID: 1
            ,pos: new Position({x:10,y:150})
            ,width: 32
            ,height: 32 
            ,speed: 1
            ,velX: .1
            ,velY: 0
        }));  
        gameEngine.entity[2].setDest(100,150);

        //walking west
        gameEngine.addEntity(new GameEntity({
            entityID: 4
            ,ownerID: 1
            ,pos: new Position({x:100,y:200})
            ,width: 32
            ,height: 32 
            ,speed: 1
            ,velX: -.1
            ,velY: 0
        }));  
        gameEngine.entity[3].setDest(10,200);

        
    }

    this.entityClicked = function(clickedEntityIdx)
    {

    }

    this.mouseMoveEnd  = function(mouseX, mouseY)
    {
       
    }

    this.mouseClicked = function(mouseX, mouseY)
    {
        gameEngine.mouseClicked(mouseX, mouseY);

        if(gameEngine.selectedEntityIdx >= 0)
        {
            gameEngine.entity[gameEngine.selectedEntityIdx].setDest(mouseX, mouseY);
        }
    }
}


    /*
    this.loadEntrance = function()
    {
        tabs.showTab("tabEntrance");
    }

    this.resumeLastMap = function()
    {
        if(user.currentMapID > 0)
        {
            data.dataRequest("map-details", {"mapID":user.currentMapID});
            data.startAutoRefresh(this.refreshRate);
        }
    }

    this.loadCustom = function(gameKey)
    {
        if(gameKey == "tutorial-1")
        {
            var dataPacket = {"mapName":"Tutorial"
                            ,"mapSize":10
                            ,"numAiToAdd":1
                            ,"allAi": "N"
                            ,"startingUnits":[
                                        [{"unitTypeKey":"infantry-1" , "numUnits":"3"}]
                                        ,[{"unitTypeKey":"infantry-1" , "numUnits":"1"}]
                                    ]
                            ,"spawnPoints":[{'tileX':5,'tileY':2},{'tileX':5,'tileY':7}]
                            ,"debug":false};

            data.dataRequest("setup-game", dataPacket);

            data.startAutoRefresh(this.refreshRate);
        }


        if(gameKey == "custom-1")
        {
            var dataPacket = {"mapName":"Easy"
                            ,"mapSize":10
                            ,"numAiToAdd":1
                            ,"startingUnits":[{"unitTypeKey":"factory-1" , "numUnits":"1"}]
                            ,"spawnPoints":[{'tileX':3,'tileY':2},{'tileX':3,'tileY':8}]
                            ,"debug":false};

            data.dataRequest("setup-game", dataPacket);

            data.startAutoRefresh(this.refreshRate);
        }

        if(gameKey == "1v1")
        {
            var dataPacket = {"mapName":"1 vs 1"
                            ,"mapSize":10
                            ,"numAiToAdd":2
                            ,"allAi": "Y"
                            ,"startingUnits":[
                                        [{"unitTypeKey":"infantry-1" , "numUnits":"1"}]
                                        ,[{"unitTypeKey":"infantry-1" , "numUnits":"1"}]
                                    ]
                            ,"spawnPoints":[{'tileX':3,'tileY':2},{'tileX':3,'tileY':8}]
                            ,"debug":false};

            data.dataRequest("setup-game", dataPacket);

            data.startAutoRefresh(this.refreshRate);
        }


        if(gameKey == "10v10")
        {
            var dataPacket = {"mapName":"10 vs 10"
                            ,"mapSize":10
                            ,"numAiToAdd":2
                            ,"allAi": "Y"
                            ,"startingUnits":[
                                        [{"unitTypeKey":"infantry-1" , "numUnits":"9"}]
                                        ,[{"unitTypeKey":"infantry-1" , "numUnits":"10"}]
                                    ]
                            ,"spawnPoints":[{'tileX':5,'tileY':2},{'tileX':5,'tileY':7}]
                            ,"debug":false};

            data.dataRequest("setup-game", dataPacket);

            data.startAutoRefresh(this.refreshRate);
        }


        if(gameKey == "1range-vs-3combat")
        {
            var dataPacket = {"mapName":"Range vs Combat"
                            ,"mapSize":10
                            ,"numAiToAdd":2
                            ,"allAi": "Y"
                            ,"startingUnits":[
                                                [{"unitTypeKey":"cannon-1" , "numUnits":"1"}]
                                                ,[{"unitTypeKey":"infantry-1" , "numUnits":"3"}]
                                             ]
                            ,"spawnPoints":[{'tileX':3,'tileY':2},{'tileX':3,'tileY':8}]
                            ,"debug":false};

            data.dataRequest("setup-game", dataPacket);

            data.startAutoRefresh(this.refreshRate);
        }

        
        if(gameKey == "2range-vs-3combat")
        {
            var dataPacket = {"mapName":"Range vs Combat"
                            ,"mapSize":10
                            ,"numAiToAdd":2
                            ,"allAi": "Y"
                            ,"startingUnits":[
                                                [{"unitTypeKey":"cannon-1" , "numUnits":"2"}]
                                                ,[{"unitTypeKey":"infantry-1" , "numUnits":"3"}]
                                             ]
                            ,"spawnPoints":[{'tileX':3,'tileY':2},{'tileX':3,'tileY':8}]
                            ,"debug":false};

            data.dataRequest("setup-game", dataPacket);

            data.startAutoRefresh(this.refreshRate);
        }


        if(gameKey == "all-units")
        {
            var dataPacket = {"mapName":"All Units"
                            ,"mapSize":10
                            ,"numAiToAdd":1
                            ,"allAi": "N"
                            ,"startingUnits":[
                                                [    {"unitTypeKey":"infantry-1" , "numUnits":"1"}
                                                    ,{"unitTypeKey":"cannon-1" , "numUnits":"1"}]

                                                ,[   {"unitTypeKey":"infantry-1" , "numUnits":"1"}
                                                     ,{"unitTypeKey":"cannon-1" , "numUnits":"1"}]
                                             ]
                            ,"spawnPoints":[{'tileX':3,'tileY':2},{'tileX':3,'tileY':8}]
                            ,"debug":false};

            data.dataRequest("setup-game", dataPacket);

            data.startAutoRefresh(this.refreshRate);
        }




    }


    this.loadEasyMap = function()
    {
        var dataPacket = {"mapName":"Easy"
                            ,"mapSize":10
                            ,"numAiToAdd":1
                            ,"startingUnits":"factory-1"
                            ,"spawnPoints":[{'tileX':3,'tileY':2},{'tileX':3,'tileY':8}]
                            ,"debug":false};

        data.dataRequest("setup-game", dataPacket);

        data.startAutoRefresh(5000);

    }

    this.dataUpdate = function()
    {
        console.log("play.dataUpdate(): " + new Date());
        data.dataRequest("update-map", {"mapID":user.currentMapID});
    }


    this.incomingData = function(action, dataPacket)
    {
        if(action == "setup-game")
        {
            console.log("setup-game");
            user.currentMapID = dataPacket.data.mapID;
            this.currentMapID = dataPacket.data.mapID;
            data.dataRequest("map-details", {"mapID":dataPacket.data.mapID});
        }

        if(action == "train")
        {        
            var idx = this.getGameObjectIdx(dataPacket.data.gameObjectID);
            var action = dataPacket.data.actions;
            var options = {actionID:action.actionID,"label":action.label, startTime:new Date(), totalTime: action.totalTime};

            this.gameObjs[idx].addAction(options);
            
        }


        if(action == "move")
        {        
            var idx = this.getGameObjectIdx(dataPacket.data.gameObjectID);
            var action = dataPacket.data.actions;
            var options = {actionID:action.actionID,"label":action.label, startTime:new Date(), totalTime: action.totalTime};

            this.gameObjs[idx].addAction(options);
            
        }



        if(action == "get-obj-options")
        {
            var options = [];

            for(var i=0;i<dataPacket.data.buildables.length;i++)
            {
                var build = dataPacket.data.buildables[i];
                var action = {"label":build.label + " - " + build.buildTime + " seconds"
                                ,action:"play.train(" + dataPacket.data.gameObjectID + ",'" + build.unitTypeKey + "', " + build.buildTime + ");gui.closeAllPopups();"
                            };
                options.push(action);
            }
                
            gui.popButtonMenu(options);
        }


        if(action == "map-details" || action == "update-map")
        {
            
            //console.log("map-details:", dataPacket.data);
            if(this.mapID != dataPacket.data.map.mapID)
            {
                this.loadMap(dataPacket);
            }
            else
            {
                this.syncMap(dataPacket);
            }

        }
    }

    this.syncMap = function(dataPacket)
    {
        for(var i=0;i<dataPacket.data.gameObj.length;i++)
        {
           var obj = dataPacket.data.gameObj[i];

           var idx = this.getGameObjectIdx(obj.gameObjectID);

           if(idx >= 0)
           {
               this.gameObjs[idx].pos = new Position({tileX:obj.tileX, tileY:obj.tileY});
               this.gameObjs[idx].data = obj;
           }
           else
           {

                var g = new GameObj();
                g.ownerID = obj.ownerID;
                g.pos = new Position({tileX:obj.tileX, tileY:obj.tileY});
                var imgKey = obj.imgKey;
                if(obj.ownerID == user.userID) imgKey+="-1-friendly";
                if(obj.ownerID != user.userID) imgKey+="-1-enemy";
                g.imgKey =  imgKey;
                g.data  = obj;

                this.gameObjs.push(g);
           }
   
        }


        for(var i=0;i<dataPacket.data.actions.length;i++)
        {
            var action = dataPacket.data.actions[i];

            var idx = this.getGameObjectIdx(action.gameObjectID);

            var t = action.startTime.split(/[- :]/);
            var startTime = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
        
            var options = {actionID:action.actionID,"label":action.label, startTime:new Date(), totalTime: action.totalTime};

            this.gameObjs[idx].addAction(options);

        }
    }



    this.loadMap = function(dataPacket)
    {
        this.resetGame();

        gui.loadTileConfig(dataPacket.data.tileConfig);
        this.tilesLoaded = true;
        
        this.mapID = dataPacket.data.map.mapID;                
        gui.debug("play.loadMap(): mapID:" + this.mapID);
        
        gameMap = "";

        var map = dataPacket.data.map;

        gameMap = new Map({canvasID:"mainGameCanvas",mapWidth:map.mapSize * this.tileSize,mapHeight:map.mapSize * this.tileSize,debug:true});
        gameMap.tileSize = this.tileSize;
        gui.setLoadingMsg("loading tilies...");
        gameMap.loadTiles(dataPacket.data.tileConfig);

        gameMap.clearTileMap();
        gameMap.mapID = this.currentMapID;


        
        for(var i=0;i<dataPacket.data.players.length;i++)
        {
            if(dataPacket.data.players[i].userID == user.userID)
            {
                //user.data.gold = dataPacket.data.players[i].gold;
                //gui.updateStat("hudGold",user.data.gold);
            }
        }


        for(var i=0;i<dataPacket.data.mapObjects.length;i++)
        {
            //gui.setLoadingMsg("adding tile " + i);
            gameMap.setTile(dataPacket.data.mapObjects[i].imgKey, dataPacket.data.mapObjects[i].tileX, dataPacket.data.mapObjects[i].tileY);

        }

                        
        for(var i=0;i<dataPacket.data.gameObj.length;i++)
        {
            var obj = dataPacket.data.gameObj[i];

            var g = new GameObj();
            g.ownerID = obj.ownerID;
            g.pos = new Position({tileX:obj.tileX, tileY:obj.tileY});
            var imgKey = obj.imgKey;
            if(obj.ownerID == user.userID) imgKey+="-1-friendly";
            if(obj.ownerID != user.userID) imgKey+="-1-enemy";
            g.imgKey =  imgKey;
            g.data  = obj;
            
            this.gameObjs.push(g);
    
        }


                
        gui.setLoadingMsg("creating map...");
        
        this.playing = true;
        gameClient = new GameClient({canvasID:"mainGameCanvas"});
        gameClient.initialize({canvasID:"mainGameCanvas"});
        gameClient.startRendering();

        this.updateInterval = setInterval(this.update, 3000);

        gui.showGameCanvas();

        gui.showHud();

        this.processDataRequests = true;

        gui.closeAllPopups();

        tabs.showTab("tabGameCanvas");

        this.playing = true;
    }

    this.resetGame = function()
    {
        this.gameObjs = [];
        this.selectedGameObjectIdx = -1;
        this.currentAction = {};
        this.playing = false;
    }



    this.render = function(context)
    {
        if(!this.playing) return;

        for(var i=0;i<this.gameObjs.length;i++)
        {
            this.gameObjs[i].render(context, this.tileSize);

            if(i == this.selectedGameObjectIdx)
            {
                context.strokeStyle = "yellow";
                context.strokeRect(this.gameObjs[i].pos.x, this.gameObjs[i].pos.y, this.tileSize, this.tileSize);
            }
        }

        if(this.selectedGameObjectIdx >= 0)
        {
            var drawX = window.innerWidth - 160;
            var drawY = 10;
            context.strokeStyle = "white";
            context.fillStyle = "white";
            context.strokeRect(drawX, drawY, 130,100);
            
            var u = this.gameObjs[this.selectedGameObjectIdx];
            
 
            context.fillText(u.data.imgKey, drawX + 5, drawY+=15);
            context.fillText("Life", drawX + 5, drawY+=15);
            context.fillText("Range", drawX + 5, drawY+=15);
            context.fillText("Move Speed", drawX + 5, drawY+=15);
            context.fillText("Att Speed", drawX + 5, drawY+=15);
            context.fillText("Damage", drawX + 5, drawY+=15);
            
            drawX = window.innerWidth - 160;
            drawY = 35;
            this.drawBoxStat(context, u.data.maxLife - u.data.damageTaken, drawX + 75, drawY);
            this.drawBoxStat(context, u.data.attackRange, drawX + 75, drawY + 12);
            this.drawBoxStat(context, u.data.movementSpeed, drawX + 75, drawY + 30);
            this.drawBoxStat(context, u.data.attackSpeed, drawX + 75, drawY + 45);
            this.drawBoxStat(context, u.data.attackDamage, drawX + 75, drawY + 60);
        }

        this.roundCheck();
    }

    this.drawBoxStat = function(context, val, drawX, drawY)
    {
        var boxSize = 5;
        
        for(var i=0;i<val;i++)
        {
            context.fillStyle = "white";
            context.fillRect(drawX + (i*boxSize), drawY, boxSize, boxSize);
            drawX+=2;
        }
    }

    this.roundCheck = function()
    {
        return;
        var objs = [];
        var numEnemyUnits = 0;
        var numFriendlyUnits = 0;
        var activeUsers = [];

        for(var i=0;i<this.gameObjs.length;i++)
        {
            if(this.gameObjs[i].isAlive())
            {
                objs.push(this.gameObjs[i]);

                if(!activeUsers.includes(this.gameObjs[i].ownerID))
                {
                    activeUsers.push(this.gameObjs[i].ownerID);
                }

                if(this.gameObjs[i].ownerID == user.userID)
                {
                    numFriendlyUnits++;
                }
                else
                {
                    numEnemyUnits++;
                }
            }
        }

        this.gameObjs = objs;

        if(activeUsers.length > 1)
        {
            return; //keep playing
        }


        if(numEnemyUnits <= 0)
        {
            this.playing = false;
            tabs.showTab("tabVictory");
        }

        if(numFriendlyUnits <= 0)
        {
            this.playing = false;
            tabs.showTab("tabDefeat");
        }
    }
    
    this.emptyAreaClicked = function(mouseX, mouseY)
    {
        user.userTookAction();
        
        var clickedPos = new Position({x:mouseX, y:mouseY});
        console.log("emptyAreaClicked(" + mouseX + "," + mouseY +"): tile:" + clickedPos.tileX + "," + clickedPos.tileY);
        var clickedOnEmpty = true;

        for(var i=0;i<this.gameObjs.length;i++)
        {
            if(this.gameObjs[i].pos.tileX == clickedPos.tileX && this.gameObjs[i].pos.tileY == clickedPos.tileY)
            {
                clickedOnEmpty = false;
                
                gui.debug("Game Obj " + i + " clicked");
                this.gameObjs[i].clicked();
                //this.selectKingdom(i);
            }
        
        }

        if(clickedOnEmpty)
        {
            if(this.selectedGameObjectIdx >= 0)
            {
                var u = this.gameObjs[this.selectedGameObjectIdx];

                if(u.actions.length <= 0 && u.ownerID == user.userID)
                {
                    var d = this.getDistance(u.pos.tileX, u.pos.tileY, clickedPos.tileX, clickedPos.tileY);
                    var secs = d * u.data.movementSpeed;
                    var html = Math.ceil(d) + " klicks " + Math.ceil(secs) + " seconds";

                    play.popPanel("panel-div-panel-mini",html);

                    this.currentAction = {"action":"move", gameObjectID:u.data.gameObjectID, destX:clickedPos.tileX, destY:clickedPos.tileY, startTime:new Date(), totalTime: secs};
                }
            }

            gui.closeAllPopups();
        }


    }

    this.confirmAction = function()
    {
        //TODO send action to server
        
        if(this.currentAction.action == "move")
        {


            var dataPacket = {"gameObjectID":this.currentAction.gameObjectID,"tileX":this.currentAction.destX,"tileY":this.currentAction.destY};
        
            data.dataRequest("move", dataPacket);

            this.selectedGameObjectIdx = -1;
            
            document.getElementById("panel-div-panel-mini").style.visibility = "hidden";
        }

        if(this.currentAction.action == "attack")
        {
            var idx = this.getGameObjectIdx(this.currentAction.gameObjectID);

            var attacker = this.gameObjs[this.selectedGameObjectIdx];

            var dataPacket = { attackerGameObjectID: attacker.data.gameObjectID, defenderGameObjectID:this.currentAction.defenderGameObjectId};
            data.dataRequest("attack", dataPacket);
            
            this.selectedGameObjectIdx = -1;
            document.getElementById("panel-div-panel-mini").style.visibility = "hidden";
        }
    }

    this.popPanel = function(panelID, html)
    {
        var d = document.getElementById(panelID);
        d.style.top = "10px";
        d.style.left = "10px";
        d.style.visibility = "visible";
        document.getElementById(panelID + "-contents").innerHTML = html;
    }

    this.nextActionID = 1;
    this.train = function(trainingGameObjectID, unitTypeKey, trainingTime)
    {
        var dataPacket = {"gameObjectID":trainingGameObjectID,"unitTypeKey":unitTypeKey};
        
        data.dataRequest("train", dataPacket);
    }



    this.setSelectedGameObj = function(gameObjectID)
    {
        this.selectedGameObjectIdx = this.getGameObjectIdx(gameObjectID);
        gui.debug("Game Object Selected: " + this.selectedGameObjectIdx);
    }

    this.getGameObjectIdx = function(id)
    {
        for(var i=0;i<this.gameObjs.length;i++)
        {
            if(this.gameObjs[i].data.gameObjectID == id || this.gameObjs[i].data.gameObjectID == id)
            {
                return i;
            }
        }

        return -1;
    }

    this.getDistance = function(x1,y1, x2, y2)
    {
        var a = x1 - x2
        var b = y1 - y2
        
        return Math.sqrt( a*a + b*b );    
    }


}


*/