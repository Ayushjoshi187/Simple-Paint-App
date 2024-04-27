var bgColor;
	var canvas;
	var canvasImage;	
	var circleCount;
	var circles;
	var color;
	var context;
	var draggingDraw;
	var draggingMove;
	var dragX;
	var dragY;
	var dragIndexDelete;
	var dragIndexMove;
	var dragStartLocation;
	var mouseX;
	var mouseY;
	var radius;
	var targetX;
	var targetY;
	var tempX;
	var tempY;
	var dx;
	var dy;
	var flagRandom= false;

window.addEventListener('load', init, false);

//resizing of canvas, based on the window size	(called on: load, resize of window)
window.onload = window.onresize = function() 
	{
		var canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth * 0.6;
		canvas.height = window.innerHeight * 0.8;
		drawCircles();
	}	

//initialize global variables	(called on: load of window)	
function init() 
	{
		canvas = document.getElementById("canvas");
		context = canvas.getContext('2d');
		context.lineWidth = 4;
		context.lineCap = 'round';
	
		circleCount=0;	
		draggingDraw = false;
		bgColor = "#000000";
		circles = [];
		
		//event listeners to draw circles
		canvas.addEventListener('mousedown', dragStart, false);
		canvas.addEventListener('mousemove', drag, false);
		canvas.addEventListener('mouseup', dragStop, false);
		
		//event listener to delete circle
		canvas.addEventListener('dblclick', deleteCircle,false);
		
		document.getElementById('resetButton').addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

	}	


//####################################################################################################################
//		Drawing of Circles with random colors	
//####################################################################################################################
	
function dragStart(event) {
    draggingDraw = true;
    dragStartLocation = getCanvasCoordinates(event);
	color = "rgb(" + Math.floor(Math.random()*200) + "," + Math.floor(Math.random()*200) + "," + Math.floor(Math.random()*200) +")";
    getImage();
}

function drag(event) {
    var position;
    if (draggingDraw === true) {
        putImage();
        position = getCanvasCoordinates(event);
        drawCircle(position);
		context.fillStyle = color;
		context.fill();
    }
}
function dragStop(event) {
    draggingDraw = false;
    putImage();
    var position = getCanvasCoordinates(event);
    drawCircle(position);		
	context.fillStyle = color;
	context.fill();	
	circleCount=circleCount+1;
	tempCircle = {x:tempX, y:tempY, rad:radius, color:color};
	
	circles.push(tempCircle);
	
}
	
function getCanvasCoordinates(event) {

    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function getImage() {
    canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    context.putImageData(canvasImage, 0, 0);
}

function drawCircle(position) {
	
		tempX=dragStartLocation.x;
		tempY=dragStartLocation.y;
		
		radius = Math.sqrt(Math.pow((tempX - position.x), 2) + Math.pow((tempY - position.y), 2));
		context.beginPath();
		context.arc(tempX, tempY, radius, 0, 2 * Math.PI, false);
		context.closePath();
}
//####################################################################################################################
//		To Move/ Delete the Circles 
//####################################################################################################################

	function drawCircles() {
		var i;
		var x;
		var y;
		var rad;
		var color;
		
		context.fillStyle = bgColor;
		context.fillRect(0,0,canvas.width,canvas.height);		
		
		for (i=0; i < circleCount; i++) {
			rad = circles[i].rad;
			x = circles[i].x;
			y = circles[i].y;
			color=circles[i].color;
			context.beginPath();
			context.arc(x, y, rad, 0, 2*Math.PI, false);
			context.closePath();
			context.fillStyle = color;
			context.fill();
		}		
	}	
	//To check whether the circle was clicked
	function isCircleClicked(shape,mx,my) {		
		var dx;
		var dy;
		dx = mx - shape.x;
		dy = my - shape.y;
		return (dx*dx + dy*dy < shape.rad*shape.rad);
	}


//####################################################################################################################
//		To Delete the Circles	(on double-click)
//####################################################################################################################
function deleteCircle(event) {
    var i;
    var bRect = canvas.getBoundingClientRect();
    dragIndexDelete = -1;
    mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
    mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);
    // To find that which circle has been clicked
    for (i = 0; i < circleCount; i++) {
      if (isCircleClicked(circles[i], mouseX, mouseY)) {
        dragIndexDelete = i;
      }
    }
    // Remove the circle from the array
    if (dragIndexDelete > -1) {
      circles.splice(dragIndexDelete, 1)[0];
      circleCount = circleCount - 1;
      drawCircles();
      displayText('Hit', mouseX, mouseY);
    } else {
      displayText('Miss', mouseX, mouseY);
    }
  
    if (event.preventDefault) {
      event.preventDefault();
    } else if (event.returnValue) {
      event.returnValue = false;
    }
    return false;
  }
  
  function displayText(text, x, y) {
    context.font = '20px Arial';
    context.fillStyle = 'red';
    context.fillText(text, x, y);
  }
