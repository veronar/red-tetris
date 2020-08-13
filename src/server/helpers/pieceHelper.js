const {randomTetromino} = require( '../../client/helpers/tetrominos');


const generateShapes = () => {
	let shapes = [];
	let i = 0
	while (i < 50) {
			shapes.push(randomTetromino())
			i++;
	}
	return shapes;
}
module.exports = generateShapes