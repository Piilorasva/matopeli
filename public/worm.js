var snake = []
var direction = 1; //oikealle
var START_LENGTH = 4;
var fps = 5;


function initGameBoard(height,width){

	//Tällä loopilla tehdään madosta startlengthin mittainen
	for ( i = 0; i < START_LENGTH; i++){
   		var row = Math.floor((width/2)); //Asetetaan riviksi keskimmäinen rivi
    	var data = Math.floor((height/2) - i); //asetetaan dataksi keskimmäinen td - kierroksen numero
   	    var locCoord = [row,data] //Tehdään taulukko joka sisältää kaksi arvoa, rivin ja sarakkeen
        snake.push(locCoord); //lisätään äsken luotu taulu käärmeen kohdaksi
    }    


	var gameboard = '<table id="gameboard">'

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
	$("#gameboard_div").html(gameboard);
	drawSnake(snake);
}
initGameBoard(33,33);

function drawSnake(snakeLoc){
	snakeCoordinates = snakeLoc;
	setTimeout(function(){
		console.log("ruudun päivitys");
		requestAnimationFrame(drawSnake);
		//console.log("Snake head at row: " +snakeCoordinates[0][0].toString()+" data:" + snakeCoordinates[0][1].toString() );
		var length = snakeCoordinates.length;
		for(i=0; i< length;i++){
			var row = snakeCoordinates[i][0];
			var data = snakeCoordinates[i][1];
			$("#r"+row+"d"+data).css("background", "green");	
		}

		if(direction == 1){//Mennään oikealle eli lisätään datan arvoa
			for(i=0; i< length;i++){
				console.log("Lisätään datan arvoa yhdellä");
			 	snakeCoordinates[i][1] += 1;
		}
		}
	},1000/fps);	
}



