let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const tableSize = 64;
const cellSize = 4;

let tickDelay = 60;

let table = [];
let loop;

let deadChance = 0.5;

const colors = {
	alive: '#f2b630',
	dead: '#333'
};

function init() {
	
	//build table
	table = [];
	
	for (let y = 0; y < tableSize; y++) {
		let row = [];
		for (let x = 0; x < tableSize; x++) {
			
			let randomAlive = true;
			if (Math.random() > deadChance) {
				randomAlive = false;
			}
			let cell = new Cell(y, x, randomAlive);
			row.push(cell);
		}
		table.push(row);
	}
	
}

function tick() {
	
	console.log("tick");
	
	table = table.map(row => row.map(cell => cell.tick()));
	
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
	loop = setInterval(tick, tickDelay);
}

function stop() {
	console.log("Stopping");
	clearInterval(loop);
}

function reset() {
	console.log("Resetting");
	clearInterval(loop);
	init();
	render();
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
		
        const isAlive = this.isAlive ? (numAliveNeighbours === 2 || numAliveNeighbours === 3) : (numAliveNeighbours === 3);
		
		return new Cell(this.x, this.y, isAlive);
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
	
	//return a list of all eight neighbours of this cell in North-East-South-West (NESW) order
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
	
	//get NORTHEAST neighbour
	targetX = x+1;
	targetY = y-1;
	if (targetY < 0)
		targetY = tableSize-1;
	if (targetX > tableSize-1)
		targetX = 0;
	
	result.push(table[targetX][targetY]);
	
	//get EAST neighbour
	targetX = x+1;
	targetY = y;
	if (targetX >= tableSize)
		targetX = 0;
	
	result.push(table[targetX][targetY]);
	
	//get SOUTHEAST neighbour
	targetX = x+1;
	targetY = y+1;
	if (targetY > tableSize-1)
		targetY = 0;
	if (targetX > tableSize-1)
		targetX = 0;
	
	result.push(table[targetX][targetY]);
	
	//get SOUTH neighbour
	targetX = x;
	targetY = y+1;
	if (targetY >= tableSize)
		targetY = 0;
	
	result.push(table[targetX][targetY]);
	
	//get SOUTHWEST neighbour
	targetX = x-1;
	targetY = y+1;
	if (targetY > tableSize-1)
		targetY = 0;
	if (targetX < 0)
		targetX = tableSize-1;
	
	result.push(table[targetX][targetY]);
	
	//get WEST neighbour
	targetX = x-1;
	targetY = y;
	if (targetX < 0)
		targetX = tableSize-1;
	
	result.push(table[targetX][targetY]);
	
	//get NORTHWEST neighbour
	targetX = x-1;
	targetY = y-1;
	if (targetY < 0)
		targetY = tableSize-1;
	if (targetX < 0)
		targetX = tableSize-1;
	
	result.push(table[targetX][targetY]);
	
	return result;
}

//Patterns

function pattern() {
	
	//Set up the board using a random preset pattern
	console.log("Creating pattern");
	clearInterval(loop);
	
	//build dead table
	table = [];
	
	for (let y = 0; y < tableSize; y++) {
		let row = [];
		for (let x = 0; x < tableSize; x++) {
			
			let cell = new Cell(y, x, false);
			row.push(cell);
		}
		table.push(row);
	}
	
	//add living cells for patterns
	
	//Glider
	
	table[1][1].isAlive = true;
	table[2][2].isAlive = true;
	table[2][3].isAlive = true;
	table[3][2].isAlive = true;
	table[3][1].isAlive = true;
	
	
	table[12][12].isAlive = true;
	table[13][13].isAlive = true;
	table[14][13].isAlive = true;
	table[13][14].isAlive = true;
	table[12][14].isAlive = true;
	
	
	render();
	
}

//Build board and render initial state
init();
render();