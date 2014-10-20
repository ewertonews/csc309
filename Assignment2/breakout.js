var c_x = 400,
	c_y = 300,
	moveX = 0,
	moveY = 7,
	c_radius = 10,
	c_width,
	canvas_height,
	p_x = 0,//(c_width / 3),	
	p_height = 15,
	p_color = "blue",
	p_y = 0,//(canvas_height - p_height),
	p_width = 150,
	context,
	ballSpeed = 0,
	pressRight = false,
	pressLeft = false,
	bl_width = 100,
	bl_height = 30,
	blocksRows = 6,
	blocksCols = 8,
	colors = ["black","red","red","yellow", "green","blue"],
	_blocks = [[0,1,1,1,1,1],[0,1,1,1,1,1],[0,1,1,1,1,1],[0,1,1,1,1,1],[0,1,1,1,1,1],[0,1,1,1,1,1],[0,1,1,1,1,1],[0,1,1,1,1,1]];
	gStart = 0,
	score = 0,
	speedChanged = 0,
	p_move = 7;
	c_speed = 1;

window.onload = function(){
	canvas = document.getElementById("myCanvas");
	scoreBoard = document.getElementById("score");
	speedBoard = document.getElementById("speed")
	context = canvas.getContext("2d");
    c_width = canvas.width;
    canvas_height = canvas.height;
    canvas.style.background = 'rgba(158, 167, 184, 0.2)';
	p_x = 350;
	p_y = canvas_height - p_height;
	
	scoreBoard.innerHTML =  "Score: " + score;
	speedBoard.innerHTML =  "Speed: " + c_speed;

	ballSpeed = setInterval(draw, 20);
	
	    
}


function setScore(){
	
	scoreBoard.innerHTML =  "Score: " + score;
	//alert(scoreBoard);
}

function setSpeedboard(){
	speedBoard.innerHTML =  "Speed: " + c_speed;
}

//if needed to change speed on the way
function setSpeed(speed){
	moveY = moveY * speed;
	p_move = p_move * speed;
}
function Circle(x, y, radius, color){
	this.x = x;
	this.y = y;
	this.radius = radius;	
	this.color = color;
}



function Paddle(x, y, width, height, color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
}

function Block(x, y, width, height, color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
}

Circle.prototype.draw = function(){
	
	context.beginPath();
	context.fillStyle = this.color;
	context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
	context.fill();
    context.stroke(); 
    context.closePath();
    
}

Circle.prototype.getX = function(){
	return this.x;
}

Circle.prototype.getY = function(){
	return this.y;
}

Circle.prototype.setY = function(y){
	this.y = y;
}

Circle.prototype.setX = function(x){
	this.x = x;
}


Paddle.prototype.draw = function(){	
	
	context.beginPath();
	context.rect(this.x, this.y, this.width, this.height);
	context.stroke();
	context.fillStyle = this.color;
	context.fill();
	context.closePath()
    
}

Block.prototype.draw = function(){
	//context.fillStyle = this.color;
	context.beginPath()
	context.rect(this.x, this.y, this.width, this.height);
	context.stroke();
	
	context.fillStyle = this.color;
	context.fill();
    context.strokeStyle = 'white';
    context.closePath();
   
}
  

function draw(){
	context.clearRect(0, 0, c_width, canvas_height);
	
	circle = new Circle(c_x, c_y, c_radius,"black");	
	circle.draw();  
	bounce(circle);		
	drawBlocks(); 
	paddle = new Paddle(p_x, p_y, p_width, p_height, p_color);
	paddle.draw();
	movePaddle();	   
	
	 
	c_x += moveX;
 	c_y += moveY;  	
 	//keep check if the player has gotten the max score 
 	congrats();	
}
   
function drawBlocks(){
				//function in line 213
	blockGone = verifCurrentBlock(circle.getX() + moveX, circle.getY() + moveY);

	//blocks creation
	
	//check if the block was hit, if so, set it's position in the array _blocks to 0 (no block will be dranw in that position of the array when it's 0)
	//change Y coordinate (I am not handling lateral colision) and increase score
	if(blockGone[2]){ //blockGone[2] is a boolean (hit)
		 if(_blocks[blockGone[0]][blockGone[1]] == 1){
		 	moveY = -moveY	
			_blocks[blockGone[0]][blockGone[1]] = 0;//false;
			
			incScores = [5,4,3,2,1] //last layer of blocks gives one ponint, second layer: 2 points and so on

			score += incScores[blockGone[1]-1];

			setScore(score);
		 }		 	
	}		

	//draw the blocks if the position which it's gonna be drawn is 1
	for (var i = 0; i < blocksCols; i++){
		for (var j=1; j <= blocksRows; j++){
			if(_blocks[i][j]==1){
				x = (i * (bl_width + 1));
				y = (j * (bl_height + 1));
								
				block = new Block(x, y, bl_width, bl_height,colors[j]) 
				block.draw();
					
			}			
		}
	}
}


//keyboard actions at the bottom of the code
function movePaddle(){
	if (pressRight){
		if(p_x <= c_width - p_width){ //prevent the paddle to go over the right wall
			p_x += p_move;
		}
		
	} 
  	else if (pressLeft){
  		if(p_x > 0){ //prevent the paddle to go over the left wall
  			p_x -= p_move;	
  		}
  		
  	}
}

//check the position of each block. return the coordinates of the block hit and a boolean to warn that the block was hit
function verifCurrentBlock(c_posX, c_posY){
	blockNumX = -1;
	blockNumY = -1;
	hit = false;

	if (c_posY > 30 && c_posY < 61 + c_radius){
        	blockNumY = 1;
        	hit = true;
        	if(speedChanged == 3){
        		setSpeed(1.4);
        		speedChanged++;
        		setSpeedboard(c_speed++);
        		p_width = p_width - 7;
        	}         	
    } else if (c_posY > 60 && c_posY < 91 + c_radius){
        	blockNumY = 2;
        	hit = true; 
        	if(speedChanged == 2){
        		setSpeed(1.3);
        		speedChanged++;	
        		setSpeedboard(c_speed++);
        		p_width = p_width - 7;
        	}        	
    } else if (c_posY > 90 && c_posY < 121 + c_radius){
        	blockNumY = 3;
        	hit = true;
        	if(speedChanged == 1){
        		setSpeed(1.2);
        		speedChanged++;	
        		setSpeedboard(c_speed++);
        		p_width = p_width - 5;
        	}         	
    }else if (c_posY > 120 && c_posY < 151 + c_radius){
        	blockNumY = 4;
        	hit = true;
        	if(speedChanged == 0){
        		setSpeed(1.1);
        		speedChanged++;	
        		setSpeedboard(c_speed++);
        		p_width = p_width - 5;
        	}     
        	   	
    }else if (c_posY > 150 && c_posY < 181 + c_radius){
        	blockNumY = 5;
        	hit = true;         	       	
    }

	    

    if (c_posX < 101){
        	blockNumX = 0;
        	//alert(blockNumX);
    } else if (c_posX > 101 && c_posX < 201){
        	blockNumX = 1;
        	//alert(blockNumX);
        	
    } else if (c_posX > 200 && c_posX < 301){
    		blockNumX = 2;
        	//alert(blockNumX);
    } else if (c_posX > 300 && c_posX < 401){
    		blockNumX = 3;
        	//alert(blockNumX);
    } else if (c_posX > 400 && c_posX < 501){
    		blockNumX = 4;
        	//alert(blockNumX);
    }else if (c_posX > 500 && c_posX < 601){
    		blockNumX = 5;
        	//alert(blockNumX);
    }else if (c_posX > 600 && c_posX < 701){
    		blockNumX = 6;
        	//alert(blockNumX);
    }else if (c_posX > 700){
    		blockNumX = 7;
        	//alert(blockNumX);
    }//===================================================

    
    		
	return [blockNumX, blockNumY, hit];
}

function bounce(circle){
	//bounce left or right (walls)
	if (circle.getX() + moveX > c_width - c_radius || circle.getX() + moveX < c_radius){
		moveX = -moveX; //change "direction" of ball (draw circle using oposite coordinates for X axis)
		//alert(circle.getX());
		
	}	

	//bounce roof
	if (circle.getY() + moveY < c_radius){
		moveY = -moveY;
	}         
  	
  	//detectin colision with the paddle
  	else if (circle.getY() + moveY > canvas_height - (p_height*1.5)) {
    	
    	if (circle.getX() > p_x && circle.getX() < p_x + p_width){
    		if(gStart == 0){
    			gStart = 1;

    			moveX = 5;
    		}
    		//alert(c_x - p_x);
    		moveY = -moveY;
    		
    		ballPosRegPad = circle.getX() - p_x;
			p_slice = Math.ceil(ballPosRegPad/5); //slices the paddle into 30 pieces;
    		inclinations = [-10,-9.5,-9,-8.5,-8,-7.5,-7,-6,-5,-4,-3.5,-3,-2,-1,0,0,1,2,3,3.5,4,5,6,7,7.5,8,8.5,9,9.5,10]
    		
    		moveX = inclinations[p_slice-1];
  		
    	}      		
    	else
    		if(circle.getY() + moveY > (c_width-200)){
    			gameOver();//game over, so stop the animation
    		}
      		
      	
  	}   	
}
    
function gameOver(){	
	clearInterval(ballSpeed);
	context.clearRect(0, 0, c_width, canvas_height);
	
	context.font = "30px Arial";
	var go = "Game Over!";
	var sc = "Your score: " + score;

	context.fillText(go,290,320);
	context.fillText(sc,290,360);
	context.fillText("Record: 120",290,400);
	
}

function congrats(){
	if (score == 120){
		clearInterval(ballSpeed);
		context.clearRect(0, 0, c_width, canvas_height);
	
		context.font = "30px Arial";
		var cong = "Congratulations!";
		var bb = "You are a brick breaker!";

		context.fillText(cong,290,320);
		context.fillText(bb,240,360);
		
	}
}

//Keyboard actions

//check which key was pressed (and hold) and set true;
function onKeyDown(evt) {
  if (evt.keyCode == 39){
  	pressRight = true;
  } 
  else if (evt.keyCode == 37){
  	pressLeft = true;
  } 
}

//check which key was release and set to false
function onKeyUp(evt) {
  if (evt.keyCode == 39){
  	pressRight = false;
  } 
  else if (evt.keyCode == 37){
  	pressLeft = false;
  } 
}

window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;


