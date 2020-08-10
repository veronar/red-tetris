import { checkCollision } from "../helpers/gameHelpers";

export const movePlayer = (dir, updatePlayerPos, player, stage) => {
	if (!checkCollision(player, stage, { x: dir, y: 0 })) {
		updatePlayerPos({ x: dir, y: 0 });
	}
};

export const dropPlayer = (setDropTime, drop, rows, level, player, stage, setLevel, updatePlayerPos, setGameOver) => {
	console.log('Interval off');
	setDropTime(null);
	drop(rows, level, player, stage, setLevel, setDropTime, updatePlayerPos, setGameOver);
};

export const drop = (rows, level, player, stage, setLevel, setDropTime, updatePlayerPos, setGameOver) => {
	// Increase level when player has cleared 10 rows
	if (rows > (level + 1) * 10) {
		setLevel((prev) => prev + 1);
		// Also increase the speed
		setDropTime(1000 / (level + 1) + 200);
	}

	if (!checkCollision(player, stage, { x: 0, y: 1 })) {
		updatePlayerPos({ x: 0, y: 1, collided: false });
	} else {
		// Game Over
		if (player.pos.y < 1) {
			console.log('GAME OVER!');
			setGameOver(true);
			setDropTime(null);
		}
		updatePlayerPos({ x: 0, y: 0, collided: true });
	}
};

export const playerRotation = (stage, dir, playerRotateFunc) => {
	playerRotateFunc(stage, dir);
}