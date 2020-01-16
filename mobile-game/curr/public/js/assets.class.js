function Assets()
{
	this.asset = new Array();

	this.loadAssets = function (assetArray) 
	{
		for(var i=0;i<assetArray.length;i++)
		{
	    	this.addAsset(assetArray[i]);
	    };

	    console.log("Assets have been loaded");
	}

	this.addAsset = function (options) 
	{

	    var a = {};
	    a.key = options.key;
	    a.width = options.width;
	    a.height = options.height;
	    a.imgSrc = options.imgSrc;
	    a.img = new Image();
	    a.img.src = a.imgSrc;


	    this.asset[a.key] = a;

	}

	this.getImage = function(imgKey) {return this.getImg(imgKey);}
	this.getImg = function (imgKey) 
	{
    	return this.asset[imgKey];
	}


	this.isNull = function (val, defaultVal) 
	{
	    if(val === undefined ) val = defaultVal;
	    if(val == "") val = defaultVal;
	    if(val == null) val = defaultVal;

	    return val;
	}


}