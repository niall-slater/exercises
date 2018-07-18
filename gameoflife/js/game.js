let game = document.getElementById('game');

const size = 25;

let rows = [];

for (let x = 0; x < size; x++) {
	let column = [];
	for (let y = 0; y < size; y++) {
		let cell = {};
		column.push(cell);
		game.innerHTML += 'o ';
	}
	rows.push(column);
	game.innerHTML += '<br />';
}
