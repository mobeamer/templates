/*
new GameEntity({
	entityID: 1
	,ownerID: 1
	,pos: new Position({x:100,y:100})
	,width: 32
	,height: 32 
	,speed: 1
	,velX: 0
	,velY:0
});
*/
function GameEntity(options)
{
	this.entityID = options.entityID;
    this.ownerID = options.ownerID;
	this.pos = options.pos;
	this.dest = options.pos;
	this.velX = options.velX;
	this.velY = options.velY;
	this.speed = options.speed;
	this.width = options.width;
	this.height = options.height;
	this.imgKey = "dog-sheet";

	this.spriteSheet = "img/sheets/dog-sheet.png";
	assets.addAsset({key:this.imgKey,width:96,height: 128,imgSrc: this.spriteSheet});

	this.wayPoints = new Array();
	this.wayPointIdx = 0;
	this.moveThroughWayPoints = true;
	this.attackRange = 50;
	this.life = gameEngine.isNull(options.life, 10);
	this.damageTaken = 0;
	this.attackDamage = 1;
	this.ai = "";

	this.renderWayPoints = false;
	this.renderInfo = false;
	this.renderLOS = true;

	this.usingFrames  = true;
	this.currentFrame = 0;
    this.maxFramesPerRow = 3;
    this.nextFrameCounter = 0;
	this.numTicksBetweenFrames = 10;
	this.movingDir = "N";
	this.isMoving = false;
	this.showAttackingAnimation = false;
	this.entityIdx = -1;

	this.sync = function(options)
	{
		this.pos = options.pos;
		this.ownerID = options.ownerID;
		
		this.dest = gameEngine.isNull(options.dest, options.pos);
		this.wayPoints = gameEngine.isNull(options.wayPoints,new Array());
		this.wayPointIdx = gameEngine.isNull(options.wayPointIdx,0);
		this.attackRange = gameEngine.isNull(options.attackRange,0);
		this.life = gameEngine.isNull(options.life,10);
		this.damageTaken = gameEngine.isNull(options.damageTaken,0);
		this.attackDamage = gameEngine.isNull(options.attackDamage,0);
		this.ai = gameEngine.isNull(options.ai,'');
	}

	this.getState = function()
	{
		var out ={
			entityID: this.entityID
			,ownerID: this.ownerID
			,pos: this.pos
			,dest: this.dest
			,wayPoints : this.wayPoints
			,wayPointIdx : this.wayPointIdx
			,attackRange : this.attackRange
			,life: this.life
			,damageTaken: this.damageTaken
			,attackDamage: this.attackDamage
			,ai: this.ai
		};

		return out;
	}

	this.isAlive = function()
	{
		return this.damageTaken < this.life;
	}

	this.getPosition = function()
	{
		var p = new Position({x:this.pos.x,y:this.pos.y});

		return p;
	}

	this.getColor = function()
	{
		if(this.ownerID == user.userID) return "blue";

		return "red";
	}


	this.setDest = function(destX, destY)
	{
		console.log("Dest set " + destX + "," + destY);

		this.dest = new Position({x:destX, y:destY});
	}

	this.startProcessing = function()
	{
		this.moveThroughWayPoints = true;
	}

	this.stopProcessing = function()
	{
		this.moveThroughWayPoints = false;
	}

	this.collisionPointCheck = function(x,y)
	{
		return x > this.pos.x 
				&& x < this.pos.x + this.width
				&& y > this.pos.y
				&& y < this.pos.y + this.height;
	}

	this.collisionCheck = function(x1, y1, w1, h1)
	{
		var x2 = this.pos.x;
		var y2 = this.pos.y;
		var h2 = this.height;
		var w2 = this.width;

		return !(
			((y1 + h1) < (y2)) ||
			(y1 > (y2 + h2)) ||
			((x1 + w1) < x2) ||
			(x1 > (x2 + w2))
		);
	}

    this.render = function(context)
    {
		if(!this.isAlive()) return;



		if(user.userID == this.ownerID)
		{
			context.fillStyle = "blue";
			gameEngine.drawEllipseByCenter(context, this.pos.x + this.width/2, this.pos.y+this.height, this.width, 10); 
		}

		if(this.entityIdx == gameEngine.selectedEntityIdx)
		{
			context.fillStyle = "yellow";
			gameEngine.drawEllipseByCenter(context, this.pos.x + this.width/2, this.pos.y+this.height, this.width, 10); 
		}

		
		var lifePct = (this.life-this.damageTaken)/this.life;
		var barWidth = this.width/2;
		context.fillStyle = "white";
		context.fillRect(this.pos.x-1 + this.width/4, this.pos.y + this.height + 1, barWidth+2, 5);
		context.fillStyle = "green";
		context.fillRect(this.pos.x + this.width/4, this.pos.y + this.height + 2, barWidth * lifePct, 3);
		
		
		this.drawCurrFrame(context, this.pos.x, this.pos.y);


		if(this.renderWayPoints && this.wayPoints.length > 0)
		{
			context.strokeStyle = "red";
			context.beginPath();
			context.moveTo(this.wayPoints[0].x, this.wayPoints[0].y);
			
			for(var i=0;i<this.wayPointIdx;i++)
			{
				context.lineTo(this.wayPoints[i].x, this.wayPoints[i].y);
			}
			context.stroke();


			context.strokeStyle = "blue";

			context.lineTo(this.wayPoints[this.wayPointIdx].x, this.wayPoints[this.wayPointIdx].y);

			for(var i=this.wayPointIdx;i<this.wayPoints.length;i++)
			{
				context.lineTo(this.wayPoints[i].x, this.wayPoints[i].y);
				
			}
			context.stroke();
		}

		if(this.renderInfo)
		{
			var drawX = this.pos.x + 10;
			var drawY = this.pos.y + this.height + 10;

			context.fillStyle = "black";
			context.fillRect(drawX, drawY, 25, 40);
			context.fillStyle = "white";
			context.fillText(this.entityID, drawX + 5, drawY + 10);
			context.fillText(this.pos.tileX + "," + this.pos.tileY, drawX + 5, drawY + 25);
		}

		if(this.renderLOS)
		{

			/*
			losRange = 10;
			for(var x=this.pos.tileX-losRange;x<this.pos.tileX+losRange;x++)
			{
				for(var y=this.pos.tileY-losRange;y<this.pos.tileY+losRange;y++)
				{
					new Ray(this.pos, new Position({tileX:x,tileY:y})).render(context);
				}
			}
			*/

			//var r = new Ray(this.pos, new Position({tileX:this.pos.tileX-3,tileY:this.pos.tileY+3})).render(context);
			//var r2 = new Ray(this.pos, new Position({tileX:6,tileY:9})).render(context);
		}
	}
	
	this.getLastWayPoint = function()
	{
		if(this.wayPoints.length <= 0)
		{
			return this.pos;
		}

		return this.wayPoints[this.wayPoints.length-1];
	}

	this.drawCurrFrame = function(context, drawX, drawY)
    {
      var cropX = this.currentFrame * this.width;
      var cropY = 0;
      var cropWidth = this.width;
      var cropHeight = this.height;
      var x = drawX;
      var y = drawY;
      var drawWidth = this.width;
      var drawHeight = this.height;
      
      
      if(this.isMoving && this.usingFrames) 
      {
     
        if(this.movingDir == 'E') cropY = this.height*2;
        if(this.movingDir == 'S') cropY = 0;
		if(this.movingDir == 'N')  cropY = this.height*3;
		if(this.movingDir == 'W') cropY = this.height;
		
		if(this.showAttackingAnimation)
		{
			cropY += this.height * 4;
		}
        //if(this.destTileY < this.tileY) cropY = 256;
        //if(this.destTileX < this.tileX) cropY = 256;
      }
      
      context.drawImage(assets.getImg(this.imgKey).img, cropX, cropY, cropWidth, cropHeight, x, y, drawWidth, drawHeight);
      if(this.usingFrames && this.isMoving)
      {
        this.nextFrameCounter++;
        if(this.nextFrameCounter > this.numTicksBetweenFrames)
        {
          this.nextFrameCounter = 0;
          this.currentFrame++;
          if(this.currentFrame >= this.maxFramesPerRow)
          {
            this.currentFrame=0;
          }

        }
      }
	}
	


	this.update = function()
	{ 
		if(!this.isAlive()) return;
		
		var keepMoving = true;


		if(keepMoving)
		{
			//this.processAi();

			this.moveToDest();

			this.processWayPoints();
		}


		/*
		var keepMoving = true;
		
		var targetIdx = game.getNearestEnemyIdx(this.entityID);

		if(targetIdx >= 0)
		{
			var target = game.entity[targetIdx];
			var d = game.getDistance(target.pos.x, target.pos.y, this.pos.x, this.pos.y);

			if(d < this.attackRange)
			{
				keepMoving = false;
				console.log("Enemy in range");
				play.fight(this.entityID, target.entityID);
				
			}
			else
			{
				this.clearWayPoints();
				play.addPath(this.entityID, target.pos.tileX, target.pos.tileY);
			}
		}

		if(keepMoving)
		{
			this.processAi();

			this.moveToDest();

			this.processWayPoints();
		}
		*/
	}

	this.processAi = function()
	{
		if(this.ai == "roam")
		{
			if(this.isAtDest() && !this.hasWayPointsLeft())
			{
				var roamRange = 10;
				var destY = this.pos.tileY;

				var destMinX = this.pos.tileX - roamRange;
				var destMaxX = this.pos.tileX + roamRange;
				if(destMinX < 1) destMinX = 2;				
				if(destMaxX > gameMap.mapTileWidth) destMaxX = gameMap.mapTileWidth - 2;

				var destMinY = this.pos.tileY - roamRange;
				var destMaxY = this.pos.tileY + roamRange;
				if(destMinY < 1) destMinY = 2;				
				if(destMaxY > gameMap.mapTileHeight) destMaxY = gameMap.mapTileHeight - 2;


				var destX = helper.getRandomNumber(destMinX, destMaxX);
				var destY = helper.getRandomNumber(destMinY, destMaxY);
				play.addPath(this.entityID, destX, destY);
			}
		}
	}

	this.isAtDest = function()
	{

		if(Math.abs(this.dest.y - this.pos.y) <= 1 && Math.abs(this.dest.x - this.pos.x) <= 1)
		{
			return true;
		}

		return false;
	}

	this.hasWayPointsLeft = function()
	{
		return this.wayPointIdx < this.wayPoints.length-1 && this.wayPoints.length > 0;
	}

	this.addWayPoint = function(p)
	{
		this.wayPoints.push(p);
		//console.log("gameEntity.addWaypoint(): waypoint added");
	}

	this.clearWayPoints = function()
	{
		this.wayPointIdx = 0;
		this.wayPoints = new Array();
	}

	this.processWayPoints = function()
	{
		if(this.moveThroughWayPoints)
		{
			if(this.isAtDest())
			{
				if(this.wayPoints.length > this.wayPointIdx)
				{
					this.dest = this.wayPoints[this.wayPointIdx];

					this.wayPointIdx++;
					if(this.wayPointIdx >= this.wayPoints.length)
					{
						//this.moveThroughWayPoints = false;
						this.wayPointIdx = this.wayPoints.length-1;
					}
				}
			}
		}
	}

	this.moveToDest = function()
	{
		if(this.dest.x != this.pos.x || this.dest.y != this.pos.y)
		{
			this.velX = 0;
			this.velY = 0;

			if(Math.abs(this.dest.x - this.pos.x) > 1)
			{
				if(this.dest.x > this.pos.x)
				{
					this.velX = 1;
				}

				if(this.dest.x < this.pos.x)
				{
					this.velX = -1;
				}
			}

			if(Math.abs(this.dest.y - this.pos.y) > 1)
			{
				if(this.dest.y > this.pos.y)
				{
					this.velY = 1;
				}

				if(this.dest.y < this.pos.y)
				{
					this.velY = -1;
				}
			}

		}

		var newX = this.pos.x + (this.velX * this.speed);
		var newY = this.pos.y + (this.velY * this.speed);
		var isAvail = gameEngine.isEmptySpot(newX, newY, this.width, this.height, this.entityIdx);

		if(isAvail)
		{
			this.pos.x =newX;
			this.pos.y = newY;
		}

		if(this.velX < 0)
		{
			this.movingDir = "W";
		}
		
		if(this.velX > 0)
		{
			this.movingDir = "E";
		}

		if(this.velY < 0)
		{
			this.movingDir = "N";
		}

		if(this.velY > 0)
		{
			this.movingDir = "S";
		}

		if(this.velX != 0 || this.velY !=0)
		{
			this.isMoving = true;
		}


		if(this.entityIdx == 1)
		{
			//console.log(this.pos.x + "," + this.pos.y + " vs " + this.dest.x + "," + this.dest.y + "");
		}

		if(this.isAtDest())
		{
			this.velX = 0;
			this.velY = 0;
			this.isMoving = false;
		}

	}



}