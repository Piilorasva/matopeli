var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : "matopeli"
});

connection.connect(function(err) {
  // connected! (unless `err` is set)
});

app.use("/public",express.static("public"));


app.get('/', function (req,res){
	res.sendfile("matopeli.html");
});

// Käyttäjä kirjautuu matopeliin
app.get("/login", function(req, res){
	// Kaapataan requestin urlista user-kohdasta nick
	var nick = req.query["user"];
	var kayttaja  = {nickname : nick}
	var queryString = 'SELECT * FROM kayttaja';
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;
	    // Käydään läpi nimet
	    for (var i in rows) {
	    	// Jos nimi löytyy jo kannasta, poistutaan
	        if (nick == rows[i].nickname){
	        	return;
	        }
	    }
	    // Nimi ei löytynyt, lisätään nimi tietokantaan
	    var query = connection.query('INSERT INTO kayttaja SET ?', kayttaja, function(err, result) {
		});
	});
});

io.on("connection", function (socket){
	socket.name = "Testihenkilö";
	
	socket.on("chat message", function(msg){
		io.emit("chat message", msg);
	});

	console.log("User connected!");
});

http.listen(3000, function(){
	console.log("Server running at port 3000");
});