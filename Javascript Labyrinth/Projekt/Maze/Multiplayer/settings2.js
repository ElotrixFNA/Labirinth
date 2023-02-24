document.addEventListener("keydown", steuern);

var newMaze;
var row = current.rowNum;
var col = current.colNum;



function up1(){
  if(!generationComplete){
    alert("Maze not Generated. Please wait a Moment");  
    return;
  }
   if(!current.walls.topWall){
        
      newMaze.setCurrentRow(newMaze.getCurrentRow()-1);
      newMaze.setup();
      newMaze.draw();
      current.highlight(newMaze.columns);
      if(current.goal){
        alert("Ziel erreicht");
      }
   }

}


function down1(){
    if(!generationComplete){
         alert("Maze not Generated. Please wait a Moment");
      return;
    }
    if(!current.walls.bottomWall){
        //alert("down");
      newMaze.setCurrentRow(newMaze.getCurrentRow()+1);
      newMaze.setup();
      newMaze.draw();
      current.highlight(newMaze.columns);
      if(current.goal){
        alert("Ziel erreicht");
      }
    }
}

function right1(){
  if(!generationComplete){
       alert("Maze not Generated. Please wait a Moment");
    return;
  }
  if(!current.walls.rightWall){
      //alert("right");
      newMaze.setCurrentCol(newMaze.getCurrentCol()+1);
      newMaze.setup();
      newMaze.draw();
      current.highlight(newMaze.columns);
      if(current.goal){
        
        alert("Ziel erreicht");
      }
  }

}

function left1(){
  if(!generationComplete){
       alert("Maze not Generated. Please wait a Moment");
    return;
  }
  if(!current.walls.leftWall){
      //alert("left");
      newMaze.setCurrentCol(newMaze.getCurrentCol()-1);
      newMaze.setup();
      newMaze.draw();
      current.highlight(newMaze.columns);
    if(current.goal){
      alert("Ziel erreicht");
    }
  }
}

function up2(){
  if(!generationComplete){
    alert("Maze not Generated. Please wait a Moment");  
    return;
  }
   if(!current.walls.topWall){
        
      newMaze.setCurrentRow(newMaze.getCurrentRow()-1);
      newMaze.setup();
      newMaze.draw();
      current.highlight(newMaze.columns);
      if(current.goal){
        alert("Ziel erreicht");
      }
   }

}
function down2(){
    if(!generationComplete){
         alert("Maze not Generated. Please wait a Moment");
      return;
    }
    if(!current.walls.bottomWall){
        //alert("down");
      newMaze.setCurrentRow(newMaze.getCurrentRow()+1);
      newMaze.setup();
      newMaze.draw();
      current.highlight(newMaze.columns);
      if(current.goal){
        alert("Ziel erreicht");
      }
    }
}

function right2(){
  if(!generationComplete){
       alert("Maze not Generated. Please wait a Moment");
    return;
  }
  if(!current.walls.rightWall){
      //alert("right");
      newMaze.setCurrentCol(newMaze.getCurrentCol()+1);
      newMaze.setup();
      newMaze.draw();
      current.highlight(newMaze.columns);
      if(current.goal){
        
        alert("Ziel erreicht");
      }
  }

}

function left2(){
  if(!generationComplete){
       alert("Maze not Generated. Please wait a Moment");
    return;
  }
  if(!current.walls.leftWall){
      //alert("left");
      newMaze.setCurrentCol(newMaze.getCurrentCol()-1);
      newMaze.setup();
      newMaze.draw();
      current.highlight(newMaze.columns);
    if(current.goal){
      alert("Ziel erreicht");
    }
  }
}
function steuern(taste){
    switch (taste.keyCode){
      

        case 87: 
        //alert("rauf wurde gedrückt");
            up1();
                break;
        
        case 65:
          //alert("links wurde gedrückt");
            left1();
                break;
        
        case 68:
          //alert("rechts wurde gedrückt");
            right1();
                break;
        
        case 83:
          //alert("runter wurde gedrückt");
            down1();
                break;
				
				
		case 38:
        //alert("rauf wurde gedrückt");
            up2();
                break;
        
        case 37:
          //alert("links wurde gedrückt");
            left2();
                break;
        
        case 39:
          //alert("rechts wurde gedrückt");
            right2();
                break;
        
        case 40:
          //alert("runter wurde gedrückt");
            down2();
                break;
    }
}


