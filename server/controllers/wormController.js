
var wormController = (function(){
var userController = require("./UserController.js");	

	//FUNKTIO OMENAN SIJOITTAMISEEN KENTÄLLE//
	function getApplePosition(state){
		var returnAppleRow;
		var returnAppleData;
		var rowNotOk = true;
		while(rowNotOk){
			returnAppleRow = Math.floor((Math.random() * state.gameboardHeight));
			returnAppleData = Math.floor((Math.random() * state.gameboardHeight));
			var length = state.snake.length;
			for(i=0; i < length;i++){
				var row = state.snake[i][0];
				var data = state.snake[i][1];
				if(returnAppleRow == row && returnAppleData == data){
					console.log("Apple inside snake");
					rowNotOk = true;
					break;
				}
				if(returnAppleRow == 0 || returnAppleRow == state.gameboardHeight -1 || returnAppleData == 0 || returnAppleData == state.gameboardWidth -1){
					console.log("Apple inside border");
					rowNotOk = true;
					break;
				} else{
					rowNotOk = false;
				}
			}
		}
		var appleCoords = [returnAppleRow,returnAppleData];
		return appleCoords;
	}

	function initSnake(state){
		localSnake = [];
		console.log("Init snake called");
		state.score = 0;
		for ( i = 0; i < state.START_LENGTH; i++){
	   		var row = Math.floor((state.gameboardWidth/2)); //Asetetaan riviksi keskimmäinen rivi
	    	var data = Math.floor((state.gameboardHeight/2) - i); //asetetaan dataksi keskimmäinen td - kierroksen numero
	   	    var locCoord = [row,data] //Tehdään taulukko joka sisältää kaksi arvoa, rivin ja sarakkeen
	        localSnake.push(locCoord); //lisätään äsken luotu taulu käärmeen kohdaksi
	    } 
	    return localSnake;

	    //drawSnake();
	}
	//FUNKTIO PELILAUDAN ALUSTUSTA VARTEN//
	function initGameBoard(height,width){
		var gameboard = '<p id = score style="text-align:center">Score: </p>'
	    gameboard += '<table id="gameboard">'

		for(i = 0; i<height; i++){
			gameboard += '<tr>';
			for (j = 0; j < width; j++){
				var id = "r"+i+"d"+j;
				var grid = '<td id="'+id+'">';
				gameboard += grid;
			}
			gameboard += '</tr>';
		}
		gameboard += '</table>';
		gameboard += '<p style="text-align: center"> Ohjaa matoa nuolinäppäimillä. Kuoleman jälkeen paina R syntyäksesi uudelleen </P>'
		$("#gameboard_div").html(gameboard);
		initSnake();
		drawApple();
	}

	//initGameBoard(gameboardHeight,gameboardWidth);
	function stateUpdater(state, nick){
		var stateToReturn = state;

		if(state.snakeAlive){
			

			if(stateToReturn.direction == 1){//Mennään ylös eli vähennetään rowin	
				 	var headrow = stateToReturn.snake[0][0] - 1;
				 	var headdata = stateToReturn.snake[0][1];
				 	var newHead = [headrow,headdata];
				 	stateToReturn.snake.splice(0,0,newHead);
				 	if(!stateToReturn.appleEaten){
				 	stateToReturn.snake.pop();
				 	}
				 	stateToReturn.appleEaten = false;
			}
			else if(stateToReturn.direction == 2){//Mennään oikealle eli lisätään datan arvoa	
				 	var headrow = stateToReturn.snake[0][0];
				 	var headdata = stateToReturn.snake[0][1] + 1;
				 	var newHead = [headrow,headdata];
				 	stateToReturn.snake.splice(0,0,newHead);
				 	if(!stateToReturn.appleEaten){
				 	stateToReturn.snake.pop();
				 	}
				 	stateToReturn.appleEaten = false;
			}
			else if(stateToReturn.direction == 3){//Mennään alas eli lisätään rowin arvoa	
				 	var headrow = stateToReturn.snake[0][0] + 1;
				 	var headdata = stateToReturn.snake[0][1];
				 	var newHead = [headrow,headdata];
				 	stateToReturn.snake.splice(0,0,newHead);
				 	if(!stateToReturn.appleEaten){
				 	stateToReturn.snake.pop();
				 	}
				 	stateToReturn.appleEaten = false;
			}
			else if(stateToReturn.direction == 4){//Mennään vasemmalle eli vähennetään datan arvoa	
				 	var headrow = stateToReturn.snake[0][0];
				 	var headdata = stateToReturn.snake[0][1] - 1;
				 	var newHead = [headrow,headdata];
				 	stateToReturn.snake.splice(0,0,newHead);
				 	if(!stateToReturn.appleEaten){
				 	stateToReturn.snake.pop();
				 	}
				 	stateToReturn.appleEaten = false;
			}

			var length = stateToReturn.snake.length;
			//törmäyksen tarkistaminen omaan häntään
			for(i=1; i < length;i++){
				var headrow = stateToReturn.snake[0][0];
				var headdata = stateToReturn.snake[0][1];
				var row = stateToReturn.snake[i][0];
				var data = stateToReturn.snake[i][1];
				if(row == headrow && data == headdata){
					stateToReturn.snakeAlive = false;
					//lähetetään tulos tietokantaan
					userController.logScore(stateToReturn.score,nick);
				}
			}
			//Törmäyksen tarkistaminen reunaan
			if(stateToReturn.snakeAlive){
				if(stateToReturn.snake[0][0] == 0 || stateToReturn.snake[0][0] == stateToReturn.gameboardHeight - 1|| stateToReturn.snake[0][1] == 0 || stateToReturn.snake[0][1] == stateToReturn.gameboardWidth - 1){
					stateToReturn.snakeAlive = false;
					//lähetetään tulos tietokantaan
					userController.logScore(stateToReturn.score,nick);
				}
			}
			//Omenan syönnin tarkistus
			if(stateToReturn.snakeAlive){
				if(stateToReturn.snake[0][0] == stateToReturn.applePosRow && stateToReturn.snake[0][1] == stateToReturn.applePosData){
					stateToReturn.appleEaten = true;
					stateToReturn.score += 1;
					var newApplePos = getApplePosition(state);
					stateToReturn.applePosRow = newApplePos[0];
					stateToReturn.applePosData = newApplePos[1];
					//drawApple();
				}
			}
		}
		return stateToReturn;
	}

	//FUNKTIO MADON PIIRTÄMISTÄ VARTEN//
	function drawSnake(){
	} 


	function gameOverScreen(){
		snake = [];
		for(i = 0; i< gameboardHeight;i++){
			for(j=0;j<gameboardWidth;j++){
				var row = i;
				var data = j;
				
				$("#r"+row+"d"+data).css("background", "black");
					
			}
		}
	}

	return{
		gameOverScreen: gameOverScreen,
		getApplePosition:getApplePosition,
		drawSnake:drawSnake,
		initSnake:initSnake,
		initGameBoard:initGameBoard,
		stateUpdater:stateUpdater
	}

})();

module.exports = wormController;
