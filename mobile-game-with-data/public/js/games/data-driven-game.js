function Game(options)
{
    this.debugNameSpace = "SampleGame()";
    
    this.socket = io();

    this.socket.on('user-has-joined', function(dataMsg){
       
        var u = dataMsg.dataPacket.user;

        if(u.userGuid == user.userGuid)
        {
            user.userID = u.userID;
            console.log("assigned userID: " + u.userID);
        }

    });


    this.socket.on('user-data', function(dataMsg){
       
        console.log("User Data");
        
        user.sync(dataMsg);
        
        //console.log(dataMsg);

        

    });


    this.socket.on('game-config', function(dataMsg){
       
        var a = dataMsg.dataPacket.config.assets;

        for(var i=0;i<a.length;i++)
        {
            assets.addAsset({key: a[i].key,width:a[i].width, height: a[i].height, imgSrc: a[i].imgSrc});
            debug("Adding Asset:" + a[i].key);
        }


    });




    this.socket.on('game-map-data', function(dataMsg){
    
        console.log("game-map-data");
        
        var tiles = dataMsg.dataPacket.tiles;

        for(var i=0;i<tiles.length;i++)
        {
            if(gameEngine != "")
            {
                gameEngine.syncTile(tiles[i]);
            }
        }

    });

   


    this.socket.on('game-entities', function(dataMsg){
    
        console.log("game-entities", dataMsg);
        
        var entities = dataMsg.dataPacket.gameEntities;

        for(var i=0;i<entities.length;i++)
        {
            if(gameEngine != "")
            {
                gameEngine.syncEntity(dataMsg.dataPacket.gameEntities[i]);
            }
        }

    });


    this.joinedServer = function()
    {
        //called immediatly after user has authenticated
        console.log(this.debugNameSpace + ": joinedServer()");
        gui.showView("viewEntrance");

        
        this.loadGame();     //dont need to call this...but am
    }

    this.loadGame = function()
    {

        this.socket.emit('get-config', {userGuid: user.userGuid});
        this.socket.emit('get-game-map-data', {userGuid: user.userGuid});

        assets.addAsset({key: 'dirt-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/dirt.png'});
        assets.addAsset({key: 'lava-tile-sheet',width:96, height: 192, imgSrc: 'img/tiles/lava.png'});
        assets.addAsset({key: 'dog-sheet',width:96, height: 192, imgSrc: 'img/sheets/dog-sheet.png'});
       
        this.socket.emit('join-server', {userGuid: user.userGuid});

        gameEngine = new GameEngine({canvasID: "mainGameCanvas"});
        gameEngine.init({canvasID: "mainGameCanvas"});
        gameEngine.startRendering();
        gui.showView("viewGameCanvas");



    }


    this.entityClicked = function(clickedEntityIdx)
    {
        if(clickedEntityIdx != gameEngine.selectedEntityIdx)
        {
            var selected = gameEngine.entity[gameEngine.selectedEntityIdx];
            var clicked = gameEngine.entity[clickedEntityIdx];

            if(selected.ownerID != clicked.ownerID)
            {
                console.log("attacking...");
                gameEngine.entity[gameEngine.selectedEntityIdx].stopAttacking(gameEngine);
                this.socket.emit('attack', {userGuid: user.userGuid
                                        ,attackingEntityID: gameEngine.entity[gameEngine.selectedEntityIdx].entityID
                                        ,defendingEntityID: gameEngine.entity[clickedEntityIdx].entityID
                                        });
            }
        }
    }

    this.emptySpaceClicked = function(mouseX, mouseY)
    {
        if(gameEngine.selectedEntityIdx >= 0)
        {
            gameEngine.entity[gameEngine.selectedEntityIdx].setDest(mouseX, mouseY);
            gameEngine.entity[gameEngine.selectedEntityIdx].setTargetEnemyIdx(-1);
            this.socket.emit('set-dest', {userGuid: user.userGuid,entityID: gameEngine.entity[gameEngine.selectedEntityIdx].entityID, destX: mouseX, destY: mouseY});
        }

        this.socket.emit('get-user-data', {userGuid: user.userGuid});
    }

    

    this.render = function(context)
    {
        context.fillStyle = "white";
        var drawX = window.innerWidth/2 - 50;
        var drawY = window.innerHeight - 20;
        context.fillText("Score: " + user.data.score, drawX, drawY);
    }

    this.mouseMoveEnd  = function(mouseX, mouseY){}

    this.mouseClicked = function(mouseX, mouseY){gameEngine.mouseClicked(mouseX, mouseY);}

    
}