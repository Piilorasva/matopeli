var userModel = require("../models/UserModel.js");

/************* USER CONTROLLER ***************/


var userController = (function () {
    function login(req, res) {
       var nick = req.query["user"];
       var kayttaja = {nickname: nick};

       userModel.login(nick, kayttaja);
   }

   function logScore(score, player){
      var scoreToLog = score;
      var playerNick = player;
      userModel.saveScore(scoreToLog,playerNick);
   }

   function derp() {
       console.log("controller derp");
   }

   function privateFunction() {
       console.log("tää on privaatti, koska tätä ei palauteta.");
   }

   /* public functions */
   /* määritellään funktiot joita voi käyttää muissa filuissa  => routes */
   return {
       login: login,
       derp: derp,
       logScore:logScore
   };
})();

// jotta controlleria voisi käyttää toisessakin tiedostossa => routes
module.exports = userController;

