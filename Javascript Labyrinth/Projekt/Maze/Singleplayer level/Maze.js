//Taste gedrückt
document.addEventListener("keydown", steuern);
var maze = document.querySelector(".maze"); //nimmt canvas auf welchem gezeichnet wird
var ctx = maze.getContext("2d"); //2d Feld  
var generationComplete = false;
var fertig = document.querySelector(".fertig");
var geschafft = document.querySelector(".geschafft");
var erneut = document.querySelector(".erneut");
var schliesen = document.querySelector(".schliesen");
var anzeige = document.querySelector("#timer");
var showkey = document.querySelector("#pic");
var current;
var newMaze;
var leftisch = false;
var rightisch = true;
var keycollected = false;
var musica = document.getElementById("myAudio");

var img = new Image();
img.src = "../../bilder/Portal.png";
var img2 = new Image();
img2.src = "../../bilder/man.png";
var img3 = new Image();
img3.src = "../../bilder/ende.png";
var img4 = new Image();
img4.src = "../../bilder/manleft.png";
var key = new Image();
key.src = "../../bilder/schlussl.png";
var keyvis = new Image();
keyvis.src = "../../bilder/schlusslcoll.png";


function neulvl() {
	sessionStorage.clear();
	location.reload();
}

function zuruck() {
	window.open("../../startmenu.html", "_self");
}


if (sessionStorage.clickcount < 5 || sessionStorage.getItem('clickcount') == null) { //null steht für nicht definiert

	var pos1 = Math.floor(Math.random() * 9) + 1; //+1 damit es nicht auf = 0 | 0
	var pos2 = Math.floor(Math.random() * 9) + 2;

} 

else if (sessionStorage.clickcount >= 5 && sessionStorage.clickcount < 10) {
	var pos1 = Math.floor(Math.random() * 14) + 1;
	var pos2 = Math.floor(Math.random() * 14) + 2;
} 

else if (sessionStorage.clickcount == 10) {
	var pos1 = Math.floor(Math.random() * 19) + 1;
	var pos2 = Math.floor(Math.random() * 19) + 2;
}




function wieder() {
	//wird definierd sobald man auf den Button erneut spielen clickt
	if (typeof(Storage) !== "undefined" || sessionStorage.getItem('clickcount')) {
		if (sessionStorage.clickcount < 11) {
			//clickcount +1 wenn Button gedrückt wird
			sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
			location.reload();
		} else {
			//beim ersten click kommt man ins level 2 und es wird definiert
			sessionStorage.clickcount = 2;
			location.reload();
		}
	}
}
if (sessionStorage.clickcount > 0) {
	//damit es Das Level überschreibt
	document.getElementById("lvlanzeigen").innerHTML = "Level:" + sessionStorage.clickcount;
}

class Maze {
	constructor(size, rows, columns) { //anleitung wie bei lego
		this.size = size;
		this.columns = columns;
		this.rows = rows;
		this.grid = []; //raster
		this.stack = [];
		this.currentRow = 0; //dass man links oben anfängt
		this.currentCol = 0;
		this.goal = false;
		this.key = false;
	}
	//Werte werden nach settings übertragen
	getCurrentRow() {
		return this.currentRow;
	}
	setCurrentRow(number) {
		this.currentRow = number;
	}

	getCurrentCol() {
		return this.currentCol;
	}

	setCurrentCol(number) {
		return this.currentCol = number;
	}

	// Macht das grid und ein neues Array welches mit den Werten gefüllt wird
	setup() {
		for (var r = 0; r < this.rows; r++) {
			var row = [];
			for (var c = 0; c < this.columns; c++) {
				//Macht einee neue Zelle der Class Cell für jedes Element und schiebt es in das maze grid array 
				var cell = new Cell(r, c, this.grid, this.size);
				//pusht die jetztige Zelle ims row Array
				row.push(cell);
			}
			//pusht die jetztige Zeile ins Row Array 
			this.grid.push(row);
		}
		// Erschafft das zu startende Grid
		current = this.grid[this.currentRow][this.currentCol];
		//Auf Feld 9 | 9 soll Ziel sein
		this.grid[this.rows - 1][this.columns - 1].goal = true;
		//zufällige position des keys
		this.grid[this.rows - pos1][this.columns - pos2].key = true;
	}

	//erklärung fortführen
	// Zeichnet den Canvas indem es die Größe nimmt und die Zellen auf dem Grid auf dem Canvas plaziert
	draw() {
		maze.width = this.size;
		maze.height = this.size;
		maze.style.background = "#5AAb61";
		// Erste Zelle wird als visited gekennzeichnet
		current.visited = true;
		for (var r = 0; r < this.rows; r++) {
			for (var c = 0; c < this.columns; c++) {
				var grid = this.grid;
				grid[r][c].show(this.size, this.rows, this.columns);
			}
		}
		// Eine Zuföllige Nachbarzelle wird als next markiert 
		var next = current.checkNeighbours();
		// wenn eine nicht besuchte Zelle zur verfügung steht
		if (next) {
			next.visited = true;
			// Added sie zum Zurückverfolugngs stack im Falle einer Sackgasse 
			this.stack.push(current);
			// Damit Homer weitergeht
			// größe der Zelle wird festgelegt
			current.highlight(this.columns);
			// Vergleicht die jetztige Zelle mit der nächsten und löscht die Wände dazwischen
			current.removeWalls(current, next);
			// Nächste Zelle ist die jetztige
			current = next;

			// Keine Nachbarn => starte Rückverfolgung 
		} else if (this.stack.length > 0) {
			var cell = this.stack.pop();
			current = cell;
			current.highlight(this.columns);
		}
		// Keine Items mehr im Stack => Man kann generation auf complete setzen
		if (this.stack.length == 0) {
			generationComplete = true;
			return;
		}

		// Ruft die draw function auf bis der stack leer ist
		window.requestAnimationFrame(() => {
			this.draw();
		});
	}
}

class Cell {
	// Constructor nimmt die number an rows und an columns und nutzt diese als coordinaten um den Canvas zu zeichnen
	constructor(rowNum, colNum, parentGrid, parentSize) {
		this.rowNum = rowNum;
		this.colNum = colNum;
		this.visited = false;
		this.walls = {
			topWall: true,
			rightWall: true,
			bottomWall: true,
			leftWall: true,
		};
		this.goal = false;
		this.key = false;
		// Parentgrid wird weitergegeben sodass checkneighbours aktiviert wird
		//Parentsize wird weitergereicht um die Größe jeder Zelle auf dem Grid zu bestimmen
		this.parentGrid = parentGrid;
		this.parentSize = parentSize;
	}

	checkNeighbours() {
		var grid = this.parentGrid;
		var row = this.rowNum;
		var col = this.colNum;
		var neighbours = [];

		// Pusht alle linien die zur verfügung stehen in den Neighbours array
		// undefinierd wird aufgerufen wenn die Zelle an einer Kante lieght
		var top = row !== 0 ? grid[row - 1][col] : undefined;
		var right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
		var bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
		var left = col !== 0 ? grid[row][col - 1] : undefined;

		//Wenn es nicht undefinierd ist werden sie in den neighbours array geschoben
		if (top && !top.visited) neighbours.push(top);
		if (right && !right.visited) neighbours.push(right);
		if (bottom && !bottom.visited) neighbours.push(bottom);
		if (left && !left.visited) neighbours.push(left);

		// sucht einen zufälligen Nachbarn aus dem Nachbarn array
		if (neighbours.length !== 0) {
			var random = Math.floor(Math.random() * neighbours.length);
			return neighbours[random];
		} else {
			return undefined;
		}
	}

	// Zeichnet die Wände
	drawTopWall(x, y, size, columns, rows) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + size / columns, y);
		ctx.stroke();
	}

	drawRightWall(x, y, size, columns, rows) {
		ctx.beginPath();
		ctx.moveTo(x + size / columns, y);
		ctx.lineTo(x + size / columns, y + size / rows);
		ctx.stroke();
	}

	drawBottomWall(x, y, size, columns, rows) {
		ctx.beginPath();
		ctx.moveTo(x, y + size / rows);
		ctx.lineTo(x + size / columns, y + size / rows);
		ctx.stroke();
	}

	drawLeftWall(x, y, size, columns, rows) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + size / rows);
		ctx.stroke();
	}

	// highlights die jetztige Zeile auf dem Grid Columns wird weitergegeben um die Größe zu bestimmen
	highlight(columns) {

		// Addition und subtraction braucht es sodass das Highlight die Wände einschliest
		// Dass jede Zelle Gleich groß ist
		var x = (this.colNum * this.parentSize) / columns + 1;
		var y = (this.rowNum * this.parentSize) / columns + 1;


		if (rightisch == true && leftisch == false && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
			ctx.drawImage(img2, x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
		}
		if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal && keycollected == true) {

			ctx.drawImage(img3, x, y, this.parentSize / columns - 3, this.parentSize / columns - 3); //nur größe vom bild
		}

		if (leftisch == true && rightisch == false && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
			ctx.drawImage(img4, x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
		}
		if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal && keycollected == false) {
			ctx.drawImage(img2, x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
		}
	}

	removeWalls(cell1, cell2) {
		// Vergleicht 2 Zellen auf X-Achse
		var x = cell1.colNum - cell2.colNum;
		// Löscht die Wände dazwischen auf der X-Achse
		if (x == 1) {
			cell1.walls.leftWall = false;
			cell2.walls.rightWall = false;
		} else if (x == -1) {
			cell1.walls.rightWall = false;
			cell2.walls.leftWall = false;
		}
		// Vergleicht 2 Zellen auf Y-Achse
		var y = cell1.rowNum - cell2.rowNum;
		// Löscht die Wände dazwischen auf der Y-Achse
		if (y == 1) {
			cell1.walls.topWall = false;
			cell2.walls.bottomWall = false;
		} 
		else if (y == -1) {
			cell1.walls.bottomWall = false;
			cell2.walls.topWall = false;
		}
	}

	// Zeichnet jede Zelle auf dem Maze Canvas
	show(size, rows, columns) {
		//größe der Zellen
		var x = (this.colNum * size) / columns;
		var y = (this.rowNum * size) / rows;

		ctx.strokeStyle = "black";
		//Linien
		ctx.lineWidth = 2;
		if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
		if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
		if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
		if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);


		if (this.goal && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
			ctx.drawImage(img, x + 1, y + 1, size / columns, size / rows);
		}
		if (this.key && keycollected == false) {
			ctx.drawImage(key, x + 1, y + 1, size / columns, size / rows);
		}
		if (this.key && keycollected == true) {
			ctx.drawImage(keyvis, x + 1, y + 1, size / columns, size / rows);
			pic.style.display = "block";
		}
	}
}

var timerVar = setInterval(countTimer, 1000);
var totalSeconds = 0;

if (sessionStorage.clickcount < 5 || sessionStorage.getItem('clickcount') == null) {
	var newMaze = new Maze(700, 10, 10);
	newMaze.setup();
	newMaze.draw();
} else if (sessionStorage.clickcount >= 5 && sessionStorage.clickcount < 10) {
	var newMaze = new Maze(700, 15, 15);
	newMaze.setup();
	newMaze.draw();
} else if (sessionStorage.clickcount == 10) {
	var newMaze = new Maze(700, 20, 20);
	newMaze.setup();
	newMaze.draw();
}


function countTimer() {
	if (generationComplete) {

		timer.style.display = "block";
		musica.play();
		++totalSeconds;
		var hour = Math.floor(totalSeconds / 3600);
		var minute = Math.floor((totalSeconds - hour * 3600) / 60);
		var seconds = totalSeconds - (hour * 3600 + minute * 60);

		if (hour < 10)
			hour = "0" + hour;

		if (minute < 10)
			minute = "0" + minute;

		if (seconds < 10)
			seconds = "0" + seconds;

		document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
		document.getElementById("timer2").innerHTML = hour + ":" + minute + ":" + seconds;

		if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
			clearInterval(timerVar);
		}
	}
}




function up() {
	//ist fertig generiert, wenn man wieder zum ausgangspunkt zurückommt
	if (!generationComplete) {
		alert("Maze not Generated. Please wait a Moment");
		return;
	}

	if (!current.walls.topWall) {

		if (!newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal || keycollected == false) { //nicht rauf bei ziel
			newMaze.setCurrentRow(newMaze.getCurrentRow() - 1);
			newMaze.setup(); //homer wird neu gezeichnet um nach oben zu gehen
			newMaze.draw();
			current.highlight(newMaze.columns); //highlight zeigt homer an, wo er ist

			if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].key) {
				keycollected = true; //wenn man auf ziel kommt, wird der schlüssel true gesetzt 
			}
		}
	}
}


function down() {
	if (!generationComplete) {
		alert("Maze not Generated. Please wait a Moment");
		return;
	}
	if (!current.walls.bottomWall) {
		//alert("down");
		if (!newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal || keycollected == false) {
			newMaze.setCurrentRow(newMaze.getCurrentRow() + 1);
			newMaze.setup();
			newMaze.draw();
			current.highlight(newMaze.columns);

			if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal && keycollected == true && (sessionStorage.clickcount < 10 || sessionStorage.getItem('clickcount') == null)) { //bräuchte man nicht da man von unten nicht zum Ziel kommt
				fertig.style.display = "block";
			} else if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal && keycollected == true && sessionStorage.clickcount == 10) {
				geschafft.style.display = "block";
			} else if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].key) {
				keycollected = true;
			}
		}
	}
}

function right() {
	if (!generationComplete) {
		alert("Maze not Generated. Please wait a Moment");
		return;
	}
	if (!current.walls.rightWall) {
		//alert("right");
		if (!newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal || keycollected == false) {
			leftisch = false;
			rightisch = true;
			newMaze.setCurrentCol(newMaze.getCurrentCol() + 1);
			newMaze.setup();
			newMaze.draw();
			current.highlight(newMaze.columns);


			if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal && keycollected == true && (sessionStorage.clickcount < 10 || sessionStorage.getItem('clickcount') == null)) { //bräuchte man nicht da man von unten nicht zum Ziel kommt
				fertig.style.display = "block";
			} else if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal && keycollected == true && sessionStorage.clickcount == 10) {
				geschafft.style.display = "block";
			} else if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].key) {
				keycollected = true;
			}
		}
	}
}

function left() {
	if (!generationComplete) {
		alert("Maze not Generated. Please wait a Moment");
		return;
	}
	if (!current.walls.leftWall) {
		//alert("left");
		if (!newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal || keycollected == false) {
			rightisch = false;
			leftisch = true;
			newMaze.setCurrentCol(newMaze.getCurrentCol() - 1);
			newMaze.setup();
			newMaze.draw();
			current.highlight(newMaze.columns);


			if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].key) {
				keycollected = true;
			}
		}
	}
}






function steuern(taste) {
	switch (taste.keyCode) {


		case 38:
		case 87:
			//alert("rauf wurde gedrückt");
			up();
			break;

		case 37:
		case 65:
			//alert("links wurde gedrückt");
			left();
			break;

		case 39:
		case 68:
			//alert("rechts wurde gedrückt");
			right();
			break;

		case 40:
		case 83:
			//alert("runter wurde gedrückt");
			down();
			break;
	}
}