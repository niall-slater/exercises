let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const tableSize = 64;
const cellSize = 4;

let tickDelay = 300;

let charAlive = 'o';
let charDead = '.';

let table = [];

const colors = {
	alive: '#f2b630',
	dead: '#333'
};

function init() {
	
	//build table
	
	for (let y = 0; y < tableSize; y++) {
		let row = [];
		for (let x = 0; x < tableSize; x++) {
			let cell = new Cell(x, y, true);
			row.push(cell);
		}
		table.push(row);
	}
}

function tick() {
	console.log("tick");
	render();
}

function render() {
	
	
	for (let y = 0; y < tableSize; y++) {
		for (let x = 0; x < tableSize; x++) {
			table[x][y].draw();
		}
	}
}

function start() {
	console.log("Starting");
	init();
	setInterval(tick, tickDelay);
}

class Cell {
	
	constructor(x, y, isAlive) {
		//The x and y values are table indices, not pixel values
		this.x = x;
		this.y = y;
		this.isAlive = isAlive;
	}
	
	draw() {
		
		if (this.isAlive) {
			ctx.fillStyle = colors.alive;
		} else {
			ctx.fillStyle = colors.dead;
		}
		
		let margin = 1;

		ctx.fillRect(this.x * cellSize + (this.x * margin), this.y * cellSize + (this.y * margin), cellSize, cellSize);
	}
}

init();