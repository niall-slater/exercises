let display = document.getElementById('display');

let treasureInput = [4,4,4];
let numCrewInput = 3;

function solve(treasure, numCrew) {
    
    let result = '?';
    
	let totalValue = 0;
	
	//Add up the total value of the treasure
	
    for (let i = 0; i < treasure.length; i++) {
		
		currentGemValue = treasure[i];
		
		totalValue += currentGemValue;
		
	}
	
	console.log('Total value of treasure is £' + totalValue);
	
	//Check to see if the total value just won't divide between them
	
	if (totalValue % numCrew != 0) {
		console.log("Can't be divided equally, abort. FAIL 1");
		display.textContent = 'NO';
		return;
	}
	
	
	
    
    display.textContent = result;
    
}

solve(treasureInput, numCrewInput);