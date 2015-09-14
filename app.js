var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
var mysql      = require('mysql');

var clientNames = [];


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'testi1234',
  database : "worms"
});

connection.connect(function(err) {
	console.log("connected to database");
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
	var queryString = 'SELECT * FROM user';
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;
	    // Käydään läpi nimet
	    for (var i in rows) {
	    	// Jos nimi löytyy jo kannasta, poistutaan
	        if (nick == rows[i].nickname){
	        	console.log("Nimimerkki jo käytössä, käytetään samaa nimimerkkiä");
	        	return;
	        }
	    }
	    // Nimi ei löytynyt, lisätään nimi tietokantaan
	    var query = connection.query('INSERT INTO user SET ?', kayttaja, function(err, result) {
	    	console.log("Lisättiin uusi käyttäjä tietokantaan");
		});
	});
	//changeName(nick);
});

io.on("connection", function (socket){
	
	
	socket.on("chat message", function(msg,sender){
		io.emit("chat message", msg,sender);
	});

	socket.on("disconnect",function(){ // kun käyttäjä lähtee niin poistetaan käyttäjän nimi listassa mikäli se on jokin muu kuin undefined
        console.log("Deleted user " + socket.name + " from list");
        if(socket.name != "undefined"){
       	    var index = clientNames.indexOf(socket.name);
			clientNames.splice(index, 1);
		}
        });

	socket.on("addMeToList",function(nick){ //tässä lisätään käyttäjä kirjautumisnapin painalluksen jälkeen serverillä olevaan listaan
		socket.name = nick;
		console.log("Added user " + nick + " to list");
		clientNames.push(nick);
	});
	
	//hakee ranking listan tietokannasta.
	socket.on("getRanking", function(){
		connection.query('SELECT user.nickname, results.maxpoints  FROM user,results WHERE user.id=results.user ORDER BY results.maxpoints ASC', function(err, rows, fields) {
	   	socket.emit("ShowRanking", JSON.stringify(rows));
		});
	});	

	console.log("User connected!");
});

setInterval(function(){ //tällä intervallilla lähetetään käyttäjille tieto kaikista nimimerkin antaneista henkilöistä
        console.log("inside setInterval");
        io.emit("listUsers", clientNames);
    },2000);



http.listen(3000, function(){
	console.log("Server running at port 3000");
});