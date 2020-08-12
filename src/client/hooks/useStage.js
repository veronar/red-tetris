import { useState, useEffect } from 'react';

import { createStage } from '../helpers/gameHelpers';

export const useStage = (player, resetPlayer, mainSocket) => {
	const [stage, setStage] = useState(createStage());
	const [rowsCleared, setRowsCleared] = useState(0);

	const addRow = (stage) => {
		for (let i = 1; i < stage.length; i++) {
			for (let j = 0; j < stage[i].length; j++) {
				stage[i - 1][j] = stage[i][j]
				if (i === 19) {
					stage[i][j] = ['B', 'test']
				}
			}
		}
		setStage(stage)
	}
	useEffect(() => {
		setRowsCleared(0);
		const sweepRows = (newStage) =>
			newStage.reduce((ack, row) => {
				if (row.findIndex((cell) => cell[0] === 0 || cell[0] === 'B') === -1) {
					setRowsCleared((prev) => prev + 1);
					ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
					// counter++
					// console.log(rowsCleared)
					// if (counter > 1)
					// 	mainSocket.emit('clearRow')
					return ack;
				}
				ack.push(row);
				return ack;
			}, []);

		const updateStage = (prevStage) => {
			// first flush stage from the previous render
			const newStage = prevStage.map((row) =>
				row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
			);

			// then draw tetromino
			player.tetromino.forEach((row, y) => {
				row.forEach((value, x) => {
					if (value !== 0) {
						newStage[y + player.pos.y][x + player.pos.x] = [
							value,
							`${player.collided ? 'merged' : 'clear'}`,
						];
					}
				});
			});

			// then check if collided
			if (player.collided) {
				resetPlayer();
				let temp = sweepRows(newStage)
				mainSocket.emit('updatePlayer', temp)
				return temp;
			}

			return newStage;
		};

		setStage((prev) => updateStage(prev));
	}, [player, resetPlayer, mainSocket]);

	return { stage, setStage, rowsCleared, addRow };
};
