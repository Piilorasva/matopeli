var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");


app.use("/public",express.static("public"));


app.get('/', function (req,res){
	res.sendfile("matopeli.html");
});

io.on("connection", function (socket){

	socket.on("chat message", function(msg){
		socket.emit("chat message", msg);
	});

	console.log("User connected!");
});

http.listen(3000, function(){
	console.log("Server running at port 3000");
});