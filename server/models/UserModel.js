// modelit ei ole oikeastaan modeleita, koska en jaksanut ottaa käyttöön ORM:ää...
// TODO - ota jokin orm käyttöön, ja erota modelit ja queryt vielä toisistaan esim. serviceillä

var db = require("../lib/dbconnect.js");

var User = (function () {

	function login(nick, kayttaja) {
		var queryString = 'SELECT * FROM user';

		db.query(queryString, function (err, rows, fields) {
			if (err) {
				throw err;
			}

		    // Käydään läpi nimet
		    for (var i in rows) {
				// Jos nimi löytyy jo kannasta, poistutaan
				if (nick === rows[i].nickname) {
					console.log("Nimimerkki jo käytössä, käytetään samaa nimimerkkiä");
					return;
				}
			}
		    // Nimi ei löytynyt, lisätään nimi tietokantaan
		    var query = db.query('INSERT INTO user SET ?', kayttaja, function (err, result) {
		    	console.log("Lisättiin uusi käyttäjä tietokantaan");
		    });

		});
	}

	function getRanking(callback) {
		var q = 'SELECT user.nickname, results.maxpoints FROM user,results WHERE user.id=results.user ORDER BY results.maxpoints ASC';

		db.query(q, function(err, rows, fields) {
			callback(rows);
			console.log(rows);
		});
	}

	function derp() {
		console.log("model derp");
	};


	/* public functions */
	return {
		login: login,
		derp: derp,
		getRanking: getRanking
	};

})();

module.exports = User;