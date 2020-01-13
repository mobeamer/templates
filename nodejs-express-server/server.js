var express = require('express')
var app = require('express')();
var http = require('http').Server(app);

var options = {logging:true}

var port = 3000;

app.use(express.static('public'));


http.listen(port, function(){
  console.log('listening on *:' + port);
});



