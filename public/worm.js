var snake = []
var direction = 1; //ylös
var START_LENGTH = 10;
var fps = 10;

var gameboardWidth = 40;
var gameboardHeight = 40;


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
	drawSnake();
}

initGameBoard(gameboardHeight,gameboardWidth);



function drawSnake(){
	setTimeout(function(){
		console.log("Snakes length:" + snake.length);
		requestAnimationFrame(drawSnake);

		//tehdään loop joka puhdistaa pöydän aina piirtämisen välissä
		for(i = 0; i< gameboardHeight;i++){
			for(j=0;j<gameboardWidth;j++){
				var rowToClear = i;
				var dataToClear = j;
				$("#r"+rowToClear+"d"+dataToClear).css("background", "white");
			}
		}

		var length = snake.length;
		for(i=0; i < length;i++){
			var row = snake[i][0];
			var data = snake[i][1];
			$("#r"+row+"d"+data).css("background", "green");	
		}

		if(direction == 1){//Mennään oikealle eli lisätään datan arvoa	
				console.log("Lisätään datan arvoa yhdellä");
			 	var headrow = snake[0][0] - 1;
			 	var headdata = snake[0][1];
			 	var newHead = [headrow,headdata];
			 	snake.splice(0,0,newHead);
			 	snake.pop();
			 	console.log("Snakes length:" + snake.length);
		}
	},1000/fps);	
}


/*
 requestAnimationFrame(mainLoop) //
        var lastCalledTime;
        var deltaTime;
 
        function mainLoop(){
            if (!lastCalledTime){
                lastCalledTime = Date.now();
            }
            deltaTime = (new Date().getTime() - lastCalledTime) / 1000;
            lastCalledTime = Date.now();
            requestAnimationFrame(mainLoop);
        } */