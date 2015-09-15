var express	    = require("express");
var app		    = express();
var http	    = require("http").Server(app);
var io		    = require("./server/sockets");
var fs		    = require("fs");
var userRoutes	    = require("./server/routes/user.js");



io.listen(http);

app.use("/public", express.static("public"));

app.get('/', function (req, res) {
    res.sendfile("client/matopeli.html");
});

app.use("/", userRoutes);




http.listen(3000, function () {
    console.log("Server running at port 3000");
});