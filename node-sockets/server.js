const express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var UserManager = require("./server-js/user-manager.class.js");
userManager = new UserManager();

var numUsers = 0;

app.use(express.static('public'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/test-auth.html');
});

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
        
        var msgs = userManager.addUser(dataPacket.userGuid);
        
        sendMsgs('general', msgs);
          
    });


});





function sendMsgs(msgGroup, msgs)
{
    for(var i=0;i<msgs.length;i++)
    {
      //console.log("...sending" , msgs[i]);
      io.emit(msgGroup, msgs[i]);
    }

}




http.listen(3000, function(){
  console.log('listening on *:3000');
});

