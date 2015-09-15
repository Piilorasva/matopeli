/* socket io stuff */
var socketio = require("socket.io");

//module.exports.listen = function (app) {
//    var io = socketio.listen(app);
//
//    io.on("connection", function (socket) {
//	socket.on("chat message", function (msg, sender) {
//	    io.emit("chat message", msg, sender);
//	});
//
//    });
//};

module.exports = (function () {
    var io = false;
    var clientNames = [];

    function listen(http) {
	io = socketio.listen(http);
	init();
    }

    function init() {
	io.on("connection", function (socket) {
	    socket.on("chat message", function (msg, sender) {
		io.emit("chat message", msg, sender);
	    });

	    socket.on("disconnect", function () { // kun käyttäjä lähtee niin poistetaan käyttäjän nimi listassa mikäli se on jokin muu kuin undefined
		console.log("Deleted user " + socket.name + " from list");
		if (socket.name !== "undefined") {
		    var index = clientNames.indexOf(socket.name);
		    clientNames.splice(index, 1);
		}
	    });
	    
	    socket.on("addMeToList", function (nick) { //tässä lisätään käyttäjä kirjautumisnapin painalluksen jälkeen serverillä olevaan listaan
		socket.name = nick;
		console.log("Added user " + nick + " to list");
		clientNames.push(nick);
	    });


	});
    }


    return {
	listen: listen
    };

})();