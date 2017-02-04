// UI
var titleLabel;
var authorLabel;
var canvas; // canvas
var canvasWidth = 720;
var canvasHeight = 420;
var canvasWidthLabel; // canvasWidth
var canvasWidthInput;
var canvasWidthPlusButton;
var canvasWidthMinusButton;
var canvasHeightLabel; // canvasHeight
var canvasHeightInput;
var canvasHeightPlusButton;
var canvasHeightMinusButton;
var horizontalBlocksLabel; // horizontalBlocks
var horizontalBlocksInput;
var horizontalBlocksPlusButton;
var horizontalBlocksMinusButton;
var verticalBlocksLabel; // verticalBlocks
var verticalBlocksInput;
var verticalBlocksPlusButton;
var verticalBlocksMinusButton;
var modeLabel; // mode
var modeSelect;
var colourLabel; // colour
var colourSelect;
var colourModeLabel; // colour mode
var colourModeButton;

var mode = 'default'; // current mode
var previousMode; // previous mode
var blocks; // blocks 2d grid

// set number of horizontal and vertical blocks
var horizontalBlocks = 25;
var verticalBlocks = 15;

var speed = 2; // speed for changing brightness
var lightingSize = 10; // how many blocks light up surrounding the current block
var colourMode = 'default';
var defaultColorHue = 0; // hue value between 0 and 360
var defaultColorSaturation = 0; // saturation value between 0 and 100

function setup() {
  // UI
  titleLabel = createElement('h1', 'Color Discovery');
  authorLabel = createElement('h2', 'Created by Alejandro Lorite');

  modeLabel = createP('Mode:'); // mode
	modeSelect = createSelect();
	modeSelect.option('default');
	modeSelect.option('diagonal');
	modeSelect.option('circles');
	modeSelect.option('mouse');
	modeSelect.option('random');
	modeSelect.option('paused');
	modeSelect.changed(function() {
		mode = modeSelect.value();
		updateBlocks();
	});

	colourLabel = createP('Color:'); // colour
	colourSelect = createSelect();
	colourSelect.option('random');
	colourSelect.option('gold');
	colourSelect.option('silver');
	colourSelect.option('bronze');
	colourSelect.option('diamond');
	colourSelect.option('emerald');
	colourSelect.option('ruby');
	colourSelect.option('sapphire');
	colourSelect.option('amethyst');
	colourSelect.changed(function() {
		changeColor(colourSelect.elt.selectedIndex);
		print(colourSelect.elt.selectedIndex);
	});

	colourModeLabel = createP('Color Mode:'); // colour mode
	colourModeButton = createButton(colourMode);
	colourModeButton.mousePressed(function() {
		changeColourMode();
	});

	canvasWidthLabel = createP('Canvas Width:'); // canvasWidth
  canvasWidthInput = createInput(canvasWidth);
  canvasWidthInput.changed(function() {
  	if (!isNaN(canvasWidthInput.value()))
  		updateCanvasWidth(int(canvasWidthInput.value()) - canvas.width)
  });
  canvasWidthPlusButton = createButton("+");
  canvasWidthPlusButton.mousePressed(function() {
  	updateCanvasWidth(5);
  });
  canvasWidthMinusButton = createButton("-");
  canvasWidthMinusButton.mousePressed(function() {
  	updateCanvasWidth(-5);
  });

  canvasHeightLabel = createP('Canvas Height:'); // canvasHeight
  canvasHeightInput = createInput(canvasHeight);
  canvasHeightInput.changed(function() {
  	if (!isNaN(canvasHeightInput.value()))
  		updateCanvasHeight(int(canvasHeightInput.value()) - canvas.height)
  });
  canvasHeightPlusButton = createButton("+");
  canvasHeightPlusButton.mousePressed(function() {
  	updateCanvasHeight(5);
  });
  canvasHeightMinusButton = createButton("-");
  canvasHeightMinusButton.mousePressed(function() {
  	updateCanvasHeight(-5);
  });

  horizontalBlocksLabel = createP('Horizontal Blocks:'); // horizontalBlocks
  horizontalBlocksInput = createInput(horizontalBlocks);
  horizontalBlocksInput.changed(function() {
  	if (!isNaN(horizontalBlocksInput.value()))
  		updateHorizontalBlocks(int(horizontalBlocksInput.value()) - horizontalBlocks)
  });
  horizontalBlocksPlusButton = createButton("+");
  horizontalBlocksPlusButton.mousePressed(function() {
  	updateHorizontalBlocks(1);
  });
  horizontalBlocksMinusButton = createButton("-");
  horizontalBlocksMinusButton.mousePressed(function() {
  	updateHorizontalBlocks(-1);
  });

  verticalBlocksLabel = createP('Vertical Blocks:'); // verticalBlocks
  verticalBlocksInput = createInput(verticalBlocks);
  verticalBlocksInput.changed(function() {
  	if (!isNaN(verticalBlocksInput.value()))
  		updateVerticalBlocks(int(verticalBlocksInput.value()) - verticalBlocks)
  });
  verticalBlocksPlusButton = createButton("+");
  verticalBlocksPlusButton.mousePressed(function() {
  	updateVerticalBlocks(1);
  });
  verticalBlocksMinusButton = createButton("-");
  verticalBlocksMinusButton.mousePressed(function() {
  	updateVerticalBlocks(-1);
  });

  canvas = createCanvas(canvasWidth, canvasHeight); // create canvas

  // code
  createBlocks(); // create blocks
  colorMode(HSB, 360, 100, 100, 1) // set default color Mode
  noStroke();
}

function draw() {
  if (mode != 'paused') {
  	// if color mode is random change color over time
  	if (colourMode == 'random') {
  		// hue
  		if (defaultColorHue > 360)
  			defaultColorHue -= 360;
  		else if (defaultColorHue < 0)
  			defaultColorHue += 360;
  		else
  			defaultColorHue += random(-3,5)*0.1;
  		// saturation
  		if (defaultColorSaturation >= 100)
  			defaultColorSaturation--;
  		else if (defaultColorSaturation <= 0)
  			defaultColorSaturation++;
  		else
  			defaultColorSaturation += random(-5,5)*0.1;
  	}
    // update brightness
    updateBrightness();
  }
  // draw blocks
  for (var x = 0; x < horizontalBlocks; x++) {
    for (var y = 0; y < verticalBlocks; y++) {
      tempColor = color(defaultColorHue, defaultColorSaturation, Math.abs(blocks[x][y]));
      fill(tempColor);
      rect(x*(width/horizontalBlocks), y*(height/verticalBlocks), width/horizontalBlocks, height/verticalBlocks);
    }
  }
}

function mouseClicked() {
	
}

function mousePressed() {
	// grab a block
}

function mouseReleased() {
	// release a block
}

function mouseDragged() {
	// move a block with the movement of the mouse aplying physics
}

function mouseWheel(event) {
  print(event.delta);

  // variable changing (scrolling up is positive and scrolling down is negative)
  switch (key) {
  	case 'z': // updates canvas width +-5
  		updateCanvasWidth(-event.delta/20);
  		break;
  	case 'x': // updates canvas height by +-5
  		updateCanvasHeight(-event.delta/20);
  	case 'c': // updates the number of horizontal blocks by +-1
  		updateHorizontalBlocks(-event.delta/100);
  		break;
  	case 'v': // updates the number of vertical blocks by +-1
  		updateVerticalBlocks(-event.delta/100);
  		break;
  	case 'b': // updates how fast the blocks change color by +-0.1
  		speed -= (event.delta/1000);
  		break;
  	case 'n': // updates the lighting size by +-1
  		lightingSize -= (event.delta/100);
  		createBlocks();
  		break;
  } 
}

function keyTyped() {
	print("typed " + key + " " + keyCode);	// I realised arrow keys can't be detected :(

	// modes
	switch (key.toLowerCase()) {
	  case 'q': // set mode to normal where all blocks light up at the same time
	  	mode = 'default';
	  	updateBlocks();
	  	break;
	  case 'w': // set mode to light blocks from the top to the opossite bottom or the other way around depending on lightningSize
	  	mode = 'diagonal';
	  	updateBlocks();
	  	break;
	  case 'e': // todo set mode to light blocks doing circles from the middle
	  	mode = 'circles';
	  	updateBlocks();
	  	break;
	  case 'i': // set mode to light up the blocks surrounding the mouse
	  	mode = 'mouse';
	  	updateBlocks();
	  	break;
	  case 'o': // set mode to random and brightess is randomised for every block
	    mode = 'random';
	    updateBlocks();
	   	break;
   	case 'p': // set mode to paused or unpause the demo
	    if (mode != 'paused') {
	      previousMode = mode;
	      mode = 'paused';
	    } else {
	      mode = previousMode;
	      previousMode = null;
	    }
	   	break;
	}
	modeSelect.elt.value = mode;
	print('Mode: ' + mode);

  // colors
  if (!isNaN(key) && int (key) != 9)
  	changeColor(int(key));
  else if (!isNaN(key) && int (key) == 9)
  	changeColourMode();
}

function createBlocks() {
	// creates the 2d block array
	blocks = [];
	for (var x = 0; x < horizontalBlocks; x++) {
    blocks[x] = []; // create nested array
  }
  updateBlocks();
}

function updateBlocks() {
	// updates the starting brightness of the blocks
	for (var x = 0; x < horizontalBlocks; x++) {
    for (var y = 0; y < verticalBlocks; y++) {
    	if (mode == 'default')
      	blocks[x][y] = -100;
      else if (mode == 'diagonal')
      	blocks[x][y] = ((x+y)*200/lightingSize) - 100;
      else if (mode == 'circles') // todo
      	blocks[x][y] = 3;
      else if (mode == 'random')
      	blocks[x][y] = random(-100, 100);
    }
  }
}

function updateBrightness() {
	// updates the blocks brightness depending of speed
  for (var x = 0; x < horizontalBlocks; x++) {
    for (var y = 0; y < verticalBlocks; y++) {
      blocks[x][y] += speed;
      if (blocks[x][y] > 100) {
        blocks[x][y] -= 200;
      }
      if (blocks[x][y] < -100) {
        blocks[x][y] += 200;
      }
    }
  }
}

function changeColor(number) {
	switch(number) {
		case 0: // random color
			setColor(random(0,360), random(0, 100));
	    break;
		case 1: // gold
			setColor(46, 78);
	    break;
	 	case 2: // silver
	 		setColor(0, 0);
	    break;
	  case 3: // bronze
	  	setColor(29.8, 75.6);
	    break;
	  case 4: // diamond
	  	setColor(191.143, 27.5);
	    break;
	  case 5: // emerald
	  	setColor(140, 60);
	    break;
	  case 6: // ruby
	  	setColor(337.4, 92.4);
	    break;
	  case 7: // sapphire
	  	setColor(216.5, 91.9);
	    break;
	  case 8: // amethyst
	  	setColor(270, 50);
	    break;
  }
  colourSelect.elt.selectedIndex = number;
}

function setColor(hue, saturation) {
	defaultColorHue = hue; // hue value between 0 and 360
  defaultColorSaturation = saturation; // saturation value between 0 and 100
}

function changeColourMode() {
	if (colourMode == 'default') {
		colourMode = 'random';
	} else if (colourMode == 'random') {
		colourMode = 'default';
	}
	print('Color mode: ' + colourMode);
	colourModeButton.html(colourMode);
}

function updateCanvasWidth(dx) {
	canvasWidth += dx;
	if (canvasWidth < -dx)
		canvasWidth = 0;
	canvasWidthInput.value(canvasWidth);
	canvas = createCanvas(canvasWidth, canvasHeight);
}

function updateCanvasHeight(dy) {
	canvasHeight += dy;
	if (canvasHeight < -dy)
		canvasHeight = 0;
	canvasHeightInput.value(canvasHeight);
	canvas = createCanvas(canvasWidth, canvasHeight);
}

function updateHorizontalBlocks(dx) {
	horizontalBlocks += dx;
	if (horizontalBlocks < -dx)
		horizontalBlocks = 1;
	horizontalBlocksInput.value(horizontalBlocks);
	createBlocks();
}

function updateVerticalBlocks(dy) {
	verticalBlocks += dy;
	if (verticalBlocks < -dy)
		verticalBlocks = 1;
	verticalBlocksInput.value(verticalBlocks);
	createBlocks();
}