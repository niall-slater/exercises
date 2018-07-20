let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const tableSize = 64;
const cellSize = 4;

let tickDelay = 30;

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
			
			let randomAlive = true;
			if (Math.random() > 0.3) {
				randomAlive = false;
			}
			let cell = new Cell(x, y, randomAlive);
			row.push(cell);
		}
		table.push(row);
	}
}

function tick() {
	
	console.log("tick");
	
	for (let y = 0; y < tableSize; y++) {
		for (let x = 0; x < tableSize; x++) {
			table[x][y].tick();
		}
	}
	
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
	
	tick() {
		
		let currentNeighbours = getNeighbours(this.x, this.y);
		
		let numAliveNeighbours = 0;
		
		for (let i = 0; i < currentNeighbours.length; i++) {
			if (currentNeighbours[i].isAlive) {
				numAliveNeighbours++;
			}
		}
		
		switch (numAliveNeighbours) {
			case 0: this.makeDead(); break;
			case 1: this.makeDead(); break;
			case 2: break;
			case 3: this.makeAlive(); break;
			case 4: this.makeDead(); break;
		}
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
	
	makeAlive() {
		this.isAlive = true;
	}
	
	makeDead() {
		this.isAlive = false;
	}
}

//Helper functions

function getNeighbours(x, y) {
	
	//return a list of all four neighbours of this cell in North-East-South-West (NESW) order
	let result = [];
	
	//wrap at the edges of the table for each neighbour
	
	let targetX;
	let targetY;
	
	//get NORTH neighbour
	targetX = x;
	targetY = y-1;
	if (targetY < 0)
		targetY = tableSize-1;
	
	result.push(table[targetX][targetY]);
	
	//get EAST neighbour
	targetX = x+1;
	targetY = y;
	if (targetX >= tableSize)
		targetX = 0;
	
	result.push(table[targetX][targetY]);
	
	//get SOUTH neighbour
	targetX = x;
	targetY = y+1;
	if (targetY >= tableSize)
		targetY = 0;
	
	result.push(table[targetX][targetY]);
	
	//get WEST neighbour
	targetX = x-1;
	targetY = y;
	if (targetX < 0)
		targetX = tableSize-1;
	
	result.push(table[targetX][targetY]);
	
	return result;
}

init();