document.addEventListener("keydown", steuern);
var maze = document.querySelector(".maze");
var ctx = maze.getContext("2d");
var generationComplete = false;
var beginn = document.querySelector(".beginn");
var fertig = document.querySelector(".fertig");
var erneut = document.querySelector(".erneut");
var schliesen = document.querySelector(".schliesen");
var anzeige = document.querySelector("#timer");
var text = document.querySelector("#text");
var anzeige = document.querySelector(".anzeige");
var anzeige1 = document.querySelector(".anzeige1");
var kalt = document.querySelector(".kalt");
var perfekt = document.querySelector(".perfekt");
var warm1 = document.querySelector(".warm1");
var warm = document.querySelector(".warm");
var current;
var newMaze;
var leftisch = false;
var rightisch = false;
var musica = document.getElementById("myAudio");

var img = new Image();
img.src = "../../bilder/Portal.png";
var img2 = new Image();
img2.src = "../../bilder/man.png";
var img3 = new Image();
img3.src = "../../bilder/ende.png";
var img4 = new Image();
img4.src = "../../bilder/manleft.png";



class Maze {
	constructor(size, rows, columns) {
		this.size = size;
		this.columns = columns;
		this.rows = rows;
		this.grid = [];
		this.stack = [];
		this.currentRow = 0; //dass man links oben anfängt
		this.currentCol = 0;
		this.goal = false;
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
				row.push(cell);
			}
			this.grid.push(row);
		}
		// Erschafft das zu startende Grid
		current = this.grid[this.currentRow][this.currentCol];
		this.grid[this.rows - 1][this.columns - 1].goal = true;
	}

	//erklärung fortführen
	// Zeichnet den Canvas indem es die Größe nimmt und die Zellen auf dem Grid auf dem Canvas plaziert
	draw() {
		maze.width = this.size;
		maze.height = this.size;
		maze.style.background = "#5AAb61";
		// Erste Zelle wird als visited gekennzeichnet
		current.visited = true;
		// Loop through the 2d grid array and call the show method for each cell instance
		for (var r = 0; r < this.rows; r++) {
			for (var c = 0; c < this.columns; c++) {
				var grid = this.grid;
				grid[r][c].show(this.size, this.rows, this.columns);
			}
		}
		// Eine Zuföllige Nachbarzelle wird als next markiert 
		var next = current.checkNeighbours();
		// wenn eine nicht besuchte Zelle ist
		if (next) {
			next.visited = true;
			// Added sie zum Backtracking stack
			this.stack.push(current);
			// Highlighted die jetztige Zelle
			// größe der Zelle wird festgelegt
			current.highlight(this.columns);
			// Vergleicht die jetztige Zelle mit der nächsten und löscht die Wände dazwischen
			current.removeWalls(current, next);
			// Nächste Zelle ist die jetztige
			current = next;

			// Keine Nachbarn => starte backtracking
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
		var x = (this.colNum * this.parentSize) / columns + 1;
		var y = (this.rowNum * this.parentSize) / columns + 1;
		if (rightisch = true && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal && leftisch == false) {
			ctx.drawImage(img2, x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
		}
		if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
			ctx.drawImage(img3, x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
		}

		if (leftisch == true || rightisch == false && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
			ctx.drawImage(img4, x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
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
		} else if (y == -1) {
			cell1.walls.bottomWall = false;
			cell2.walls.topWall = false;
		}
	}

	// Zeichnet jede Zelle auf dem Maze Canvas
	show(size, rows, columns) {
		var x = (this.colNum * size) / columns;
		var y = (this.rowNum * size) / rows;

		ctx.strokeStyle = "black";
		//hintergrund
		ctx.fillStyle = "#5AAb61";
		ctx.lineWidth = 2;
		if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
		if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
		if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
		if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
		if (this.visited) {
			ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
		}
		if (this.goal && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
			ctx.drawImage(img, x + 1, y + 1, size / columns, size / rows);
		}
	}
}

function start(grose, spalten) {

	beginn.style.display = "none";
	newMaze = new Maze(grose, spalten, spalten);
	//var newMaze = new Maze(600, 10, 10);
	newMaze.setup();
	newMaze.draw();
}



var timerVar = setInterval(countTimer, 1000);
var totalSeconds = 0;



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

			if (minute < 1) {
				kalt.style.display = "block";

			}

			if (minute >= 1 && minute < 2) {
				perfekt.style.display = "block"

			}
			if (minute >= 2 && minute < 5) {
				warm1.style.display = "block"
			}
			if (minute >= 5) {
				warm.style.display = "block"
			}
		}
	}
}

function zuruck() {
	window.open("../../startmenu.html", "_self");
}


erneut.addEventListener("click", () => {
	location.reload();
});



function up() {
	if (!generationComplete) {
		alert("Maze not Generated. Please wait a Moment");
		return;
	}
	if (!current.walls.topWall && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {

		newMaze.setCurrentRow(newMaze.getCurrentRow() - 1);
		newMaze.setup();
		newMaze.draw();
		current.highlight(newMaze.columns);
		img2.src = "../../bilder/man.png";

		if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {

			fertig.style.display = "block";
			text.style.display = "block";
			anzeige.style.display = "none";
			anzeige1.style.display = "block";


		}
	}

}


function down() {
	if (!generationComplete) {
		alert("Maze not Generated. Please wait a Moment");
		return;
	}
	if (!current.walls.bottomWall && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
		//alert("down");
		newMaze.setCurrentRow(newMaze.getCurrentRow() + 1);
		newMaze.setup();
		newMaze.draw();
		current.highlight(newMaze.columns);
		if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {

			fertig.style.display = "block";
			text.style.display = "block";
			anzeige.style.display = "none";
			anzeige1.style.display = "block";
		}
	}
}

function right() {
	if (!generationComplete) {
		alert("Maze not Generated. Please wait a Moment");
		return;
	}
	if (!current.walls.rightWall && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
		//alert("right");
		leftisch = false;
		rightisch = true;
		newMaze.setCurrentCol(newMaze.getCurrentCol() + 1);
		newMaze.setup();
		newMaze.draw();
		current.highlight(newMaze.columns);

		if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {

			fertig.style.display = "block";
			text.style.display = "block";
			anzeige.style.display = "none";
			anzeige1.style.display = "block";
		}
	}

}

function left() {
	if (!generationComplete) {
		alert("Maze not Generated. Please wait a Moment");
		return;
	}
	if (!current.walls.leftWall && !newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {
		//alert("left");
		rightisch = false;
		leftisch = true;
		newMaze.setCurrentCol(newMaze.getCurrentCol() - 1);
		newMaze.setup();
		newMaze.draw();
		current.highlight(newMaze.columns);
		if (newMaze.grid[newMaze.getCurrentRow()][newMaze.getCurrentCol()].goal) {


			fertig.style.display = "block";
			text.style.display = "block";
			anzeige.style.display = "none";
			anzeige1.style.display = "block";

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







