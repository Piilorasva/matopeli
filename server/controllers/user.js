var userModel = require("../models/User.js");

///************* USER CONTROLLER ***************/

var userController = (function () {
    function login(req, res) {
	var nick = req.query["user"];
	var kayttaja = {nickname: nick};
	
	userModel.login(nick, kayttaja);
    }
    
    function derp() {
	console.log("controller derp");
    }
    
    function privateFunction() {
	console.log("tää on privaatti");
    }
    
    /* public functions */
    /* määritellään funktiot joita voi käyttää muissa filuissa  => routes */
    return {
	login: login,
	derp: derp
    };
})();

// jotta controlleria voisi käyttää toisessakin tiedostossa => routes
module.exports = userController;

