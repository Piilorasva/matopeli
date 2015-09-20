/* socket io stuff goes in this file */
var socketio 	= require("socket.io");
var userModel	= require("./models/UserModel.js");
var PubSub 		= require("pubsub-js");
var wormController = require("./controllers/wormController.js");

/*var drawInfo = {
	snake : [],
	direction : 2, //oikealle
	START_LENGTH : 8,
    appleEaten : false,
   	snakeAlive : false,
	score : 0,

	gameboardWidth : 65,
	gameboardHeight : 65,

	applePosRow :0, 
	applePosData:0
} */


module.exports = (function () {
	var io = false;
	var clientNames = [];

	/* laitetaan socketti kuuntelemaan http servua, jonka jälkeen alustetaan loput */
	function listen(http) {
		io = socketio.listen(http);
		init();
	}

	function socketListeners() {
		io.on("connection", function (socket) {
			socket.state = {
				snake : [],
				direction : 2, //oikealle
				START_LENGTH : 8,
			    appleEaten : false,
			   	snakeAlive : false,
				score : 0,

				gameboardWidth : 65,
				gameboardHeight : 65,

				applePosRow :0, 
				applePosData:0
			}

			socket.on("chat message", function (msg, sender) {
				io.emit("chat message", msg, sender);
			});

		    socket.on("disconnect", function () { // kun käyttäjä lähtee niin poistetaan käyttäjän nimi listassa mikäli se on jokin muu kuin undefined
		    	console.log("Deleted user " + socket.name + " from list");
		    	if (socket.name !== "undefined") {
		    		var index = clientNames.indexOf(socket.name);
		    		clientNames.splice(index, 1);
		    		PubSub.publish("PLAYERLIST", playerList);
		    	}
		    });

		    socket.on("addMeToList", function (nick) { //tässä lisätään käyttäjä kirjautumisnapin painalluksen jälkeen serverillä olevaan listaan
		    	socket.name = nick;
		    	console.log("Added user " + nick + " to list");
		    	clientNames.push(nick);
		    	PubSub.publish("PLAYERLIST", playerList);
		    });

		    socket.on("getRanking", function() {
		    	userModel.getRanking(function(result) {
		    		console.log(result);
		    		socket.emit("ShowRanking", JSON.stringify(result));
		    	});
		    	//socket.emit("ShowRanking", JSON.stringify("asd"));
		    });

		    socket.on("directionUp",function(){
		    	console.log(socket.name + " going up");
		    });
		    socket.on("directionDown",function(){
		    	console.log(socket.name + " going down");
		    });
		    socket.on("directionLeft",function(){
		    	console.log(socket.name + " going left");
		    });
		    socket.on("directionRight",function(){
		    	console.log(socket.name + " going right");
		    });
		    socket.on("restart",function(){
		    	if(!socket.state.snakeAlive){
			    	socket.state.snakeAlive = true;
			    	socket.state.snake = wormController.initSnake();
			    	socket.emit("sendInfoRestarted",socket.state);
			    	console.log(socket.name + " pressed restart");
		    	}else{
		    		console.log("Player tried to restart while alive");
		    	}
		    });

		    setInterval(function(){
		    	socket.emit("sendState",socket.state);
		    },50);
		    
		    socket.emit("initBoard", socket.state);
		    console.log("User connected and drawinfo sent");
		});
	}

	/* subscribe local topics - voidaan käyttää myös ranking listan päivityksessä */
	function subscribeTopics() {
		var token = PubSub.subscribe("PLAYERLIST", playerList);
	}

	function playerList() {
		io.emit("listUsers", clientNames);
	}

	/* init */
	function init() {
		subscribeTopics();
		socketListeners();
	}

	/* public functions */
	return {
		listen: listen
	};

})();