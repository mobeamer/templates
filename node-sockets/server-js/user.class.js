function User(options)
{
  this.debugNameSpace = "User()";
  this.userID = options.userID;
  this.userGuid = options.userGuid;
  this.lastActionTime = new Date();
  this.data = options.data;
  
  console.log(this.debugNameSpace + ": userGuid:" + this.userGuid);
  console.log(this.debugNameSpace + ": userID:" + this.userID);

} 

if(typeof module !== "undefined") module.exports = User;