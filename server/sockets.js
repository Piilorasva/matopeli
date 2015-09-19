/* socket io stuff goes in this file */
var socketio 	= require("socket.io");
var userModel	= require("./models/UserModel.js");
var PubSub 		= require("pubsub-js");




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