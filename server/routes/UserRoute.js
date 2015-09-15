var express	    = require('express');
var userController  = require("../controllers/UserController.js");

/************* ROUTES FOR USER ***************/
/* tänne controlleri funktiot */

module.exports = (function() {
    var router = express.Router();

    router.get("/derp", userController.derp);
    router.get("/login", userController.login);

    return router;
})();