function User()
{
 
  this.runningOnClient = true;
  this.userID = -1;
  this.userGuid = -1;
  this.userName = "Unknown Player";
  this.lastActionTime = new Date();
  this.currentGameIdx = -1;
  this.currentGameGuid = "";
  this.currentMapID = -1;
  this.userName = "Unknown Player";
  this.data = {};
  this.debug = true;
  
  if(!this.runningOnClient) 
  {
    this.userGuid = this.isNull(opt.userGuid,'');
  }
  
  this.init = function(options)
  {
    gui.debug("user.init()");
    this.userGuid = this.getData("userGuid")
    gui.debug("...user.init(): guid on file: " + this.userGuid);

    if(this.isNull(this.userGuid,-1) == -1)
    {
      gui.debug("...user.init(): no userGuid found");
      
     
      gui.debug("...user.init(): generating guid");
      this.userGuid = this.generateGuid();
      this.setData("userGuid",this.userGuid);

      gui.debug("...user.init(): new guid:" + this.userGuid);
      
    }
    
    gui.debug("...user.init(): guid: " + this.userGuid);
    gui.debug("...user.init(): userID: " + this.userID);
    
    this.lastActionTime = new Date();
  }
  


  this.sync = function(dataPacket)
  {
    gui.setLoadingMsg("user.sync(): user data synced with server...");

    if(dataPacket.userID !== undefined) user.userID = dataPacket.userID;
    if(dataPacket.username !== undefined) user.userName = dataPacket.username;
    if(dataPacket.currentMapID !== undefined) user.currentMapID = dataPacket.currentMapID;

    gui.debug("user.sync(): userID:" + user.userID);
    gui.debug("user.sync(): userGuid:" + user.userGuid);
    gui.debug("user.sync(): username:" + user.userName);



    gui.setLoadingMsg("user.sync(): joining game...");
    
    startPlaying(); //in index.html

  }


  this.saveAccountInfo = function()
  {
    var uName = document.getElementById("txtUserName").value;

    if(uName.trim() == "")
    {
      document.getElementById("txtUserNameError").innerHTML = "Invalid username";
      return;
    }

    this.saveUserName(uName)
   
    
    var uPass = document.getElementById("txtPassword").value;

    if(uPass.trim() == "")
    {
      document.getElementById("txtPasswordError").innerHTML = "Invalid password";
      return;
    }

    this.savePassword(uPass);
    


  }

  this.login = function()
  {
    var userName = document.getElementById("txtLoginUserName").value;
    var pass = document.getElementById("txtLoginPassword").value;

    data.userLogin(userName, pass);
  }


  this.saveUserName = function(userName)
  {
    this.userName = userName;
    data.saveUserName(userName);

  }

  
  this.savePassword = function(pass)
  {
    data.saveUserPassword(pass);
  }


  this.logout = function()
  {
    this.clear();
    this.init({});
  }
  
  this.getApiKeys = function(options)
  {
    var out = {currentGameGuid: this.currentGameGuid
              ,currentGameID: this.currentGameID
              ,userGuid : this.userGuid
              };
    return out;
  }
  
  
  this.userTookAction = function()
  {
    this.lastActionTime = new Date();
  }
  
  
  this.getSecsOfInactivity = function()
  {
    var timePassed = (new Date() - this.lastActionTime) / 1000;
    
    return timePassed;
  }
  
  this.clear = function()
  {
    this.userGuid = -1;
    this.userID = -1;
    localStorage.setItem("userGuid", this.userGuid);
    
  }
  
  this.setUserID = function(uID)
  {
    this.userID = uID; 
    console.log("user.setUserID(): UserID:" + this.userID);
  }
  
  this.getUserID = function(){return this.userID}
  
  this.getData = function(key)
  {
    var out= "";
    
    if(typeof localStorage !== 'undefined')
    {
      out = localStorage.getItem(key);
    }
    
    return out;
  }
  
  
  this.setData = function(key, val)
  {
    if(typeof localStorage !== 'undefined')
    {
      localStorage.setItem(key, this.userGuid);
    }
  }
  
  
  
  this.generateGuid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  
  this.isNull = function(val, defaultVal){  if( val ) { return val;} return defaultVal;}
  
  
}

if(typeof module !== "undefined") module.exports = User;