import React, { useState } from 'react';

import { createStage } from '../helpers/gameHelpers';

// Styled Component
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
	// console.log(createStage());

	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);

	const [player, updatePlayerPos, resetPlayer] = usePlayer();
	const [stage, setStage] = useStage(player, resetPlayer);

	console.log('re-render');

	const movePlayer = (dir) => {
		updatePlayerPos({ x: dir, y: 0 });
	};

	const startGame = () => {
		console.log('test');
		// Reset everything
		setStage(createStage());
		resetPlayer();
	};

	const drop = () => {
		updatePlayerPos({ x: 0, y: 1, collided: false });
	};

	const dropPlayer = () => {
		drop();
	};

	const move = ({ keyCode }) => {
		if (!gameOver) {
			// 37 = left arrow, -1 on x axis
			// 39 = right arrow, +1 on x axis
			// 40 = down arrow
			//

			if (keyCode === 37) {
				movePlayer(-1);
			} else if (keyCode === 39) {
				movePlayer(1);
			} else if (keyCode === 40) {
				dropPlayer();
			}
		}
	};

	return (
		<StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={(e) => move(e)}>
			<StyledTetris>
				<Stage stage={stage} />
				<aside>
					{gameOver ? (
						<Display gameOver={gameOver} text="Game Over" />
					) : (
						<div>
							<Display text="Score" />
							<Display text="Rows" />
							<Display text="Level" />
						</div>
					)}
					<StartButton callback={startGame} />
				</aside>
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Tetris;
