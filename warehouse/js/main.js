let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const colors = {
	yellow: '#f2b630',
	gray: '#535353'
};

let warehouseSize = 10;	//indices
let grid = [];
let cellSize = 32;	//pixels
let cellMargin = 2;

function init() {
	
	//Set up warehouse map
	
	for (let y = 0; y < warehouseSize; y++) {
		let row = [];
		for (let x = 0; x < warehouseSize; x++) {
			row.push(new Cell(x, y));
		}
		grid.push(row);
	}
	
}

function render() {
	
	for (let y = 0; y < warehouseSize; y++) {
		for (let x = 0; x < warehouseSize; x++) {
			grid[x][y].draw();
		}
	}
	
	robot.draw();
}

function submit() {
	
	let command = document.getElementById('command').value.toUpperCase();
	
	console.log("Received command " + command);
	
	for (let i = 0; i < command.length; i++) {
		robot.move(command[i]);
	}
	
	render();
	
}

let robot = {
	
	x: 5,
	y: 5,
	
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
		
	},
	
	draw: function() {
		ctx.fillStyle = colors.yellow;
		ctx.fillRect(cellMargin + this.x * cellSize + cellMargin * this.x, cellMargin + this.y * cellSize + cellMargin * this.y, cellSize, cellSize);
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

init();
render();