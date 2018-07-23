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
			robot.commandMove(currentCommand);
			continue;
		} else if (currentCommand === 'G') {
			robot.commandGrab();
			continue;
		} else if (currentCommand === 'D') {
			robot.commandDrop();
			continue;
		} else {
			console.log('Invalid command sequence. Error at command ' + i + ": " + currentCommand);
		}
	}
    
    robot.carryOutMoveOrder();
	
	render();
	document.getElementById('command').value = '';
}

let robot = {
	
	x: 2,
	y: 2,
	
	heldCrate: null,
    
    movementQueue: [],
	
	commandMove: function(direction) {
        
        let action = {x: 0, y: 0, dir: ''};
	
		switch (direction) {
			case 'N':
                action = {x:0,y:-1, dir: direction}
                this.movementQueue.push(action);
                break;
				
			case 'E': 
                action = {x:1,y:0, dir: direction}
                this.movementQueue.push(action);
                break;
				
			case 'S':
                action = {x:0,y:1, dir: direction}
                this.movementQueue.push(action);
                break;
				
			case 'W':
                action = {x:-1,y:0, dir: direction}
                this.movementQueue.push(action);
                break;
				
			default:
				console.log('Invalid command');
				break;
		}
		
	},
    
    carryOutMoveOrder: function() {
        
        //Iterate through actions in queue and validate them
        
        for (let i = 0; i < this.movementQueue.length; i++) {
            
            let currentAction = this.movementQueue[i];
            let movement = {x: 0, y: 0};
            
            if (this.x + currentAction.x < 0) {
                console.log("West wall is in the way.");
                continue;
            } else if (this.x + currentAction.x > warehouseSize-1) {
                console.log("East wall is in the way.");
                continue;
            } else if (this.y + currentAction.y < 0) {
                console.log("North wall is in the way.");
                continue;
            } else if (this.y + currentAction.y > warehouseSize-1) {
                console.log("South wall is in the way.");
                continue;
            } else {
                //Action is valid, apply it to the movement vector
                
                movement.x = currentAction.x;
                movement.y = currentAction.y;
                
                //Collapse two compatible moves into one diagonal move, if found
                if (i < this.movementQueue.length-1) {
                    let nextAction = this.movementQueue[i+1];
                    let compareString = currentAction.dir += nextAction.dir;
                    
                    console.log('comparestring is ' + compareString);
                    
                    if (compareString.includes('N') && compareString.includes('E')) {
                        console.log('Moving diagonally: NE');
                        movement = {x: 1, y: -1};
                        //Completed two commands by moving diagonally - remove two actions from start of queue
                        this.movementQueue.splice(0, 2);
                        
                    } else if (compareString.includes('E') && compareString.includes('S')) {
                        console.log('Moving diagonally: SE');
                        movement = {x: 1, y: 1};
                        this.movementQueue.splice(0, 2);
                        
                    } else if (compareString.includes('S') && compareString.includes('W')) {
                        console.log('Moving diagonally: SW');
                        movement = {x: -1, y: 1};
                        this.movementQueue.splice(0, 2);
                        
                    } else if (compareString.includes('W') && compareString.includes('N')) {
                        console.log('Moving diagonally: NW');
                        this.movementQueue.splice(0, 2);
                        movement = {x: -1, y: -1};
                        
                    } else {
                        //Only completed one command - remove one action from start of queue
                        this.movementQueue.splice(0, 1);
                    }
                    
                    //Apply movement vector to position
                    console.log("Moving " + movement.x + ", " + movement.y);
                    this.x += movement.x;
                    this.y += movement.y;
                    
                    compareString = '';
                }
            }
        }
        
        //Bring crate along with us
        
		if (this.heldCrate != null) {
			this.heldCrate.x = this.x;
			this.heldCrate.y = this.y;
		}
    },
	
	commandGrab: function() {
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
	
	commandDrop: function() {
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