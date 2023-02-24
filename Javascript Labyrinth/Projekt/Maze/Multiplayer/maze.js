var maze = document.querySelector(".maze");
var ctx = maze.getContext("2d");
var generationComplete = false;





var current;


class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];
    this.currentRow = 0;
    this.currentCol = 0;
    this.goal = false;
  }
  getCurrentRow(){
    return this.currentRow;
  }
  setCurrentRow(number){
    this.currentRow = number;
  }
  
  getCurrentCol(){
    return this.currentCol;
  }

  setCurrentCol(number){
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

  // Zeichnet den Canvas indem es die Größe nimmt und die Zellen auf dem Grid auf dem Canvas plaziert
  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
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
    window.requestAnimationFrame(() =>{
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
    ctx.fillStyle = "purple";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
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
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
    if (this.goal) {
      ctx.fillStyle = "rgb(83, 247, 43)";
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }
}
//function start(grose, spalten){


//}

var newMaze = new Maze(600, 10, 10);
newMaze.setup();
newMaze.draw();








