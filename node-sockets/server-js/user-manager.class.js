
var DataPacket = require("../server-js/data-packet.class.js");
var User = require("../server-js/user.class.js");

function UserManager() 
{
  this.debugNameSpace = "UserManager";
  this.users = new Array();
  this.numUsers = 0;
  this.serverMsgLog = [];
  
  var debugOptions = { 
                    allowUserToJoin: true
                    ,numAi: 1
                    ,debugEmits: false
                    ,debugFrameRate: false
              };

  
  
  this.init = function()
  {
      this.users = new Array();
      this.numUsers = 0;
  }
  
  
  this.addUser = function(userGuid)
  {
    var out = new Array();

    console.log(this.space + ": attempting to add " + userGuid + " to server");

    for(var i=0;i<this.users.length;i++)
    {
      if(this.users[i].userGuid == userGuid)
      {
        console.log(this.debugNameSpace + ": user allready on the server");
        out.push(new DataPacket("assign-user-id", {userID:i,userGuid:userGuid}));
        return out;
      }
    }

    
    console.log(this.debugNameSpace + ": user not found, adding");

    
    var u = new User(
            {
            userID:this.numUsers
            ,userGuid:userGuid
            , data: {}
            }
    );


    this.users.push(u);

    out.push(new DataPacket("assign-user-id", {userID:this.numUsers,sendToUserOnly:userGuid}));

    this.numUsers++;   
    
    console.log(this.debugNameSpace + ": adding user " + this.numUsers + " (idx:" + this.users.length + ")");

    return out;    
  }
 
}

if(typeof module !== "undefined")  module.exports = UserManager;