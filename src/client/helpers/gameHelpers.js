export const STAGE_WIDTH = 10; // PDF says width must be 10, change later
export const STAGE_HEIGHT = 20;

export const createStage = () =>
	Array.from(Array(STAGE_HEIGHT), () =>
		new Array(STAGE_WIDTH).fill([0, 'clear'])
	);

export const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
	for (let y = 0; y < player.tetromino.length; y += 1) {
		for (let x = 0; x < player.tetromino[y].length; x += 1) {
			// 1. check that we are on an actual tetromino cell
			if (player.tetromino[y][x] !== 0) {
				if (
					// 2. check that move is in boundaries height (y)
					!stage[y + player.pos.y + moveY] ||
					// 3. check that move is in boundaries width (x)
					!stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
					// 4. check that cell moving to isnt clear
					stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
					'clear'
				) {
					return true;
				}

			}
		}
	}
};
