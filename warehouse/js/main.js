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
	
	console.log(grid);
}

function render() {
	
	for (let y = 0; y < warehouseSize; y++) {
		for (let x = 0; x < warehouseSize; x++) {
			grid[x][y].draw();
		}
	}
	
}

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