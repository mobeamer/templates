function GameEngine(options)
{
    this.canvasID = options.canvasID;
    this.canvas = document.getElementById(options.canvasID);
    this.keepRendering = true;
    this.targetFps = 60;
    this.lastCalledTime = Date.now();
    this.fps = 0;
    this.scale = 1;
    this.lastMouseClick = new Position({x:0,y:0});
    this.lastMouseMove = new Position({x:0,y:0});
    this.entity = new Array();
    this.tiles = new Array();
    this.particle = new Array();
    this.selectedEntityIdx = -1;
    this.loopInterval = "";

    this.showFPS = false;

    this.offscreenCanvas = "";
    this.offscreenOffsetX = 0;
    this.offscreenOffsetY = 0;

    this.engineOptions = {
                autoSelectChar: true
    };

    this.init = function(options)
    {
        this.canvasID = options.canvasID;
        this.canvas = document.getElementById(options.canvasID);
    
        this.orientationChange();

        this.resizeCanvas();
    }


    
    this.startRendering = function()
    {
        this.loopInterval = setInterval("window.requestAnimationFrame(gameEngine.render)",1000 / this.targetFps);
        this.keepRendering = true;
    }

    this.stopRendering = function()
    {
        this.keepRendering = false;
    }

    this.setEntityVel = function(entityID, velX, velY)
    {
        for(var i=0;i<this.entity.length;i++)
        {
            if(entityID == this.entity[i].entityID)
            {
                this.entity[i].velX = velX;
                this.entity[i].velY = velY;
                
            }
        }
        
    }

    this.loadTileMapAt = function(startX,startY, tileSize, tileSetKey,  tileMap, isWalkable)
    {
        for(var x = 0;x<tileMap.length;x++)
        {
            for(var y = 0; y<tileMap[x].length;y++)
            {
                if(tileMap[x][y] > 0)
                {
                    var tileOptions = {
                        tileSetKey: tileSetKey
                      , pos: new Position({x: startX + x * tileSize, y: startY + y* tileSize})
                      , tileIdx: tileMap[x][y]
                      , tileWidth:tileSize
                      , tileHeight:tileSize
                      , tileSize:tileSize
                      , isWalkable: isWalkable
                      , label: ""};         
                      
                    var t = new Tile(tileOptions);

                    this.tiles.push(t);
                      
                }
            }
        }
    }


    this.addEntity = function(options)
    {
        this.syncEntity(options);
    }

    this.syncEntity = function(options)
    {
        var entityFound = false;
        for(var i=0;i<this.entity.length;i++)
        {
            if(options.entityID == this.entity[i].entityID)
            {
                this.entity[i].sync(options);
                entityFound = true;
                return;
            }
        }
        
        if(!entityFound)
        {
            var e = new GameEntity(options);
            e.sync(options);
            e.entityIdx = this.entity.length;
            this.entity.push(e);

            if(e.ownerID == user.userID && this.selectedEntityIdx <= 0)
            {
                this.selectedEntityIdx = this.entity.length-1;
            }
        }
    }


    
    this.render = function()
    {
        //this is called from outside the object (window), don't refer to "this", use gameClient instead
        var canvas = gameEngine.canvas;
        var context = gameEngine.canvas.getContext("2d");
        context.clearRect(0,0,canvas.width, canvas.height);
        var scale = gameEngine.scale;

        var scaledWidth = canvas.width * scale;
        var scaledHeight = canvas.height * scale;
        
        context.save();
        context.translate(-((scaledWidth-canvas.width)/2), -((scaledHeight-canvas.height)/2));
        context.scale(scale, scale);
        
        var finalContext = context;

        var offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = window.innerWidth * 2; //gameMap.mapTileWidth * gameMap.tileSize;
        offscreenCanvas.height =  window.innerHeight * 2; //gameMap.mapTileHeight * gameMap.tileSize;
        context = offscreenCanvas.getContext('2d');
    

        //
        //scaled things go here
        //

        context.fillStyle = "green";
        context.fillRect(0,0,canvas.width, canvas.height);
        
        
        for(var i=0;i<gameEngine.tiles.length;i++)
        {
            //gameEngine.tiles[i].update();
            gameEngine.tiles[i].render(context, 0,0, {});
        }

        if(gameMap != "") gameMap.render(context);

        for(var i=0;i<gameEngine.entity.length;i++)
        {
            gameEngine.entity[i].update();
            gameEngine.entity[i].render(context);
        }

        for(var i=0;i<gameEngine.particle.length;i++)
        {
            gameEngine.particle[i].update();
            gameEngine.particle[i].render(context);
        }

        /*
        if(gameClient.lastMouseMove.x > 0)
        {
            context.strokeStyle = "red";
            context.beginPath();
            context.arc(gameClient.lastMouseMove.tileX * gameMap.tileSize + gameMap.tileSize/2, gameClient.lastMouseMove.tileY * gameMap.tileSize + gameMap.tileSize/2, 10, 0, 2 * Math.PI);
            context.stroke();
        }

        
        if(gameEngine.selectedEntityIdx >= 0)
        {
            var e = game.entity[gameEngine.selectedEntityIdx];

            if(e.isAlive())
            {
                context.strokeStyle = "red";
                context.beginPath();
                context.arc(e.pos.x + e.width/2, e.pos.y + e.height/2, e.width, 0, 2 * Math.PI);
                context.stroke();
    
            }
        }


        */


        
        context.restore();

        
        if(gameEngine.showFPS) gameEngine.renderDebug(context);

        if(typeof play.render !== "undefined") play.render(context);
        
        finalContext.drawImage(offscreenCanvas,gameEngine.offscreenOffsetX,gameEngine.offscreenOffsetY);// this.viewX + this.offscreenOffsetX, this.viewY + this.offscreenOffsetY);


        
        if(!gameEngine.keepRendering)
        {
            if(this.loopInterval) clearInterval(this.loopInterval);
            //debug("Stopping rendering");
        }

        if(!gameEngine.lastCalledTime) 
        {
            gameEngine.lastCalledTime = Date.now();
            gameEngine.fps = 0;
         }
         else
         {
            var delta = (Date.now() - gameEngine.lastCalledTime)/1000;
            gameEngine.lastCalledTime = Date.now();
            gameEngine.fps = 1/delta;
         }
         

    }

    this.renderDebug = function(context)
    {
        //this is called from outside the object (window), don't refer to "this", use gameClient instead
        var drawX = gameEngine.canvas.width - 100;
        var drawY = gameEngine.canvas.height - 200;

        context.fillStyle = "#333";
        context.fillRect(drawX, drawY, 100, 200);
        drawX+=5;
        context.fillStyle = "white";
        context.font = "10px Arial";
        context.fillText("Debug", drawX, drawY+=15);
        context.fillText("FPS: " + Math.round(gameClient.fps), drawX, drawY+=15);
        context.fillText("Mouse: " + touchLastX + "," + touchLastY, drawX, drawY+=15);
        if(gameMap != "") context.fillText("Objs: " + gameMap.mapObjs.length, drawX, drawY+=15);
     }


    

    this.resizeCanvas = function() 
    {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    this.drawEllipseByCenter = function(ctx, cx, cy, w, h) 
    {
        gameEngine.drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
    }
      
    this.drawEllipse = function(ctx, x, y, w, h) 
    {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle
      
        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        //ctx.closePath(); // not used correctly, see comments (use to close off open path)
        ctx.fill();
    }
    
    this.mouseClicked = function(mouseX, mouseY)
    {
        for(var i=0;i<this.entity.length;i++)
        {
            if(this.entity[i].collisionPointCheck(mouseX, mouseY))
            {
                console.log("Entity Clicked:" + i);

                if(this.engineOptions.autoSelectChar)
                {
                    if(this.entity[i].ownerID == user.userID)
                    {
                        this.selectedEntityIdx = i;
                    }
                }
                play.entityClicked(i);


                
            }
        }
    }

    this.isEmptySpot = function(x1, y1, width, height, excludeEntityIdx)
    {
        for(var i=0;i<this.entity.length;i++)
        {
            if(i != excludeEntityIdx && this.entity[i].collisionCheck(x1, y1, width, height))
            {
                return false;                
            }
        }

        for(var i=0;i<this.tiles.length;i++)
        {
            if(this.tiles[i].collisionCheck(x1, y1, width, height))
            {
                return false;                
            }
        }


        return true;
    }

    this.orientationChange = function() {

        switch(window.orientation) {  
        case -90 || 90:
            debug("Landscape Detected");
            gameEngine.resizeCanvas({canvasID:this.canvasID});
            break; 
        default:
            debug("Portrait Detected");
            gameEngine.resizeCanvas({canvasID:this.canvasID});
            break; 
        }
    }

    
	this.isNull = function(val, defaultVal)
	{
		if(val) return val;

		return defaultVal;
	}
}