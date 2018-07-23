let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const colors = {
	yellow: '#f2b630',
	gray: '#535353',
	brown: '#9b6035'
};

let warehouseSize = 10;	//indices
let grid = [];
let cellSize = 32;	//pixels
let cellMargin = 2;
let robotSize = 16;

let crates = [];

function init() {
	
	//Set up warehouse map
	
	for (let y = 0; y < warehouseSize; y++) {
		let row = [];
		for (let x = 0; x < warehouseSize; x++) {
			row.push(new Cell(x, y));
		}
		grid.push(row);
	}
	
	crates.push(new Crate(4, 4));
	crates.push(new Crate(9, 0));
}

function render() {
	
	for (let y = 0; y < warehouseSize; y++) {
		for (let x = 0; x < warehouseSize; x++) {
			grid[x][y].draw();
		}
	}
	
	crates.forEach(function(crate) {
		crate.draw();
	});
	
	robot.draw();
}

function submit() {
	
	let command = document.getElementById('command').value.toUpperCase();
	
	console.log("Received command " + command);
    
    let commands = command.split(' ');
	
	for (let i = 0; i < commands.length; i++) {
		
		let currentCommand = commands[i];
		
		if (currentCommand.length > 1) {
            console.log("Invalid command sequence. Input single-character commands separated by spaces.")
            continue;
        }
			
		else if (currentCommand === 'N' || currentCommand === 'E' || currentCommand === 'S' || currentCommand === 'W') {
			robot.move(currentCommand);
			continue;
		} else if (currentCommand === 'G') {
			robot.grab();
			continue;
		} else if (currentCommand === 'D') {
			robot.drop();
			continue;
		} else {
			console.log('Invalid command sequence. Error at command ' + i + ": " + currentCommand);
		}
	}
	
	render();
	document.getElementById('command').value = '';
}

let robot = {
	
	x: 2,
	y: 2,
	
	heldCrate: null,
	
	move: function(direction) {
		
		switch (direction) {
			case 'N': 
				if (this.y < 1) {
					console.log("Can't go further north");
					break;
				} else {
					this.y--;
					break;
				}
				break;
				
			case 'E': 
				if (this.x > warehouseSize-2) {
					console.log("Can't go further east");
					break;
				} else {
					this.x++;
					break;
				}
				break;
				
			case 'S': 
				if (this.y > warehouseSize-2) {
					console.log("Can't go further south");
					break;
				} else {
					this.y++;
					break;
				}
				break;
				
			case 'W':
				if (this.x < 1) {
					console.log("Can't go further west");
					break;
				} else {
					this.x--;
					break;
				}
				break;
				
			default:
				console.log('Invalid command');
				break;
		}
		
		if (this.heldCrate != null) {
			this.heldCrate.x = this.x;
			this.heldCrate.y = this.y;
		}
		
	},
	
	grab: function() {
		console.log('Grabbing crate');
		
		if (this.heldCrate != null) {
			console.log('Aborted: already holding crate');
			return;
		}
		
		crates.forEach(function(crate) {
			if (crate.x === robot.x && crate.y === robot.y) {
				robot.heldCrate = crate;
				console.log('Grabbed crate.');
				return;
			}
		});
		
		if (this.heldCrate === null)
			console.log('Aborted: no crate at this location');
	},
	
	drop: function() {
		console.log('Dropping crate');
		
		for (let i = 0; i < crates.length; i++) {
			
			let crate = crates[i];
			
			if (crate === robot.heldCrate) {
				continue;
			}
			
			if (crate.x === robot.x && crate.y === robot.y) {
				console.log('Aborted: existing crate in the way.');
				return;
			}
			
			console.log('Dropped crate.');
			robot.heldCrate = null;
		}
	},
	
	draw: function() {
		ctx.fillStyle = colors.yellow;
		ctx.fillRect(cellMargin + this.x * cellSize + cellMargin * this.x + robotSize/2, cellMargin + this.y * cellSize + cellMargin * this.y + robotSize/2, robotSize, robotSize);
	}
	
};

class Cell {
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	draw() {
		ctx.fillStyle = colors.gray;
		ctx.fillRect(cellMargin + this.x * cellSize + cellMargin * this.x, cellMargin + this.y * cellSize + cellMargin * this.y, cellSize, cellSize);
	}
}

class Crate {
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	draw() {
		ctx.fillStyle = colors.brown;
		ctx.fillRect(cellMargin + this.x * cellSize + cellMargin * this.x, cellMargin + this.y * cellSize + cellMargin * this.y, cellSize, cellSize);
	}
}

init();
render();