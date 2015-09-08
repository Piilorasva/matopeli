var snake = []
var direction = 1; //oikealle
var START_LENGTH = 8;


function initGameBoard(height,width){
	for ( i = 0; i < START_LENGTH; i++){
   		var row = Math.floor((width/2));
    	var data = Math.floor((height/2) - i);
   	    var locCoord = [row,data]
        snake.push(locCoord);
    }    


console.log("Gameboard init");
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


function drawSnake(snakeLoc){
	console.log(snakeLoc);
	var length = snake.length;
	for(i=0; i< length;i++){
		var row = snakeLoc[i][0];
		var data = snakeLoc[i][1];
		$("#r"+row+"d"+data).css("background", "red");
	}
	
}


initGameBoard(33,33);
