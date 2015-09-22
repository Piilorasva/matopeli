/* socket io stuff goes in this file */
var socketio 	= require("socket.io");
var userModel	= require("./models/UserModel.js");
var PubSub 		= require("pubsub-js");
var wormController = require("./controllers/wormController.js");



module.exports = (function () {
	var io = false;
	var clientNames = [];
	var matches = [];
	/* laitetaan socketti kuuntelemaan http servua, jonka jälkeen alustetaan loput */
	function listen(http) {
		io = socketio.listen(http);
		init();
	}

	function socketListeners() {
		io.on("connection", function (socket) {
			socket.state = {
				snake : [(1,1)],
				direction : 2, //oikealle
				START_LENGTH : 8,
			    appleEaten : false,
			   	snakeAlive : false,
				score : 0,

				gameboardWidth : 65,
				gameboardHeight : 65,

				applePosRow :5, 
				applePosData:5
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
		    	matches.push(socket);
		    	PubSub.publish("PLAYERLIST", playerList);
		    });

		    socket.on("getRanking", function() {
		    	userModel.getRanking(function(result) {
		    		//console.log(result);
		    		socket.emit("ShowRanking", JSON.stringify(result));
		    	});
		    });

		    socket.on("directionUp",function(){
		    	socket.state.direction = 1;
		    	console.log(socket.name + " going up");
		    });
		    socket.on("directionDown",function(){
		    	socket.state.direction = 3;
		    	console.log(socket.name + " going down");
		    });
		    socket.on("directionLeft",function(){
		    	socket.state.direction = 4;
		    	console.log(socket.name + " going left");
		    });
		    socket.on("directionRight",function(){
		    	socket.state.direction = 2;
		    	console.log(socket.name + " going right");
		    });
		    socket.on("restart",function(){
		    	console.log("R pressed");
		    	if(matches.length > 1){
		    		if(socket === matches[0]){socket.state.snake = wormController.initSnake1(matches[0].state);}
		    		if(socket === matches[1]){socket.state.snake = wormController.initSnake2(matches[1].state);}
		    		//matches[0].state.snake = wormController.initSnake1(matches[0].state);
		    		//matches[1].state.snake = wormController.initSnake2(matches[1].state);
		    		socket.state.snakeAlive = true;
			    	//if(!matches[0].state.snakeAlive && !matches[1].state.snakeAlive){
				    	//socket.state.snake = wormController.initSnake(socket.state);
				    	if(matches[0].state.snakeAlive && matches[1].state.snakeAlive){

				    	var applePos = wormController.getApplePosition(socket.state);
				    	socket.state.applePosRow = applePos[0];
				    	socket.state.applePosData = applePos[1];
				    	matches[0].emit("sendInfoRestarted",{own:matches[0].state,enemy:matches[1].state});
				    	matches[1].emit("sendInfoRestarted",{own:matches[1].state,enemy:matches[0].state});
				    	}
				    	console.log(socket.name + " pressed restart");
			    	}else{
			    		console.log("Player tried to restart while alive");
			    	}
		    	//}
		    });

		    setInterval(function(){
		    	if(matches.length > 1){
			    	if(matches[0].state.snakeAlive&&matches[1].state.snakeAlive &&matches[0].state.snake.length >1 && matches[1].state.snake.length > 1){
			    	matches[0].state = wormController.stateUpdater(matches[0].state, matches[0].name);
			    	matches[1].state = wormController.stateUpdater(matches[1].state, matches[1].name);
			    	matches[0].emit("sendState",{own:matches[0].state,enemy:matches[1].state});
			    	matches[1].emit("sendState",{own:matches[1].state,enemy:matches[0].state});
			    	console.log("Sending state");
			    	}
		    	}
		    },750);

		    setInterval(function(){
		    	if(matches.length > 1){
		    		console.log(matches[0].name);
		    		console.log(matches[0].state.snakeAlive);
		    		console.log(matches[0].state.snake.length);
		    		console.log(matches[1].name);
		    		console.log(matches[1].state.snakeAlive);
		    		console.log(matches[1].state.snake.length);
		    	}
		    },3000);
		    
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