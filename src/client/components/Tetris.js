import React, { useState } from 'react';

import { createStage, checkCollision } from '../helpers/gameHelpers';

// Styled Component
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import {movePlayer, dropPlayer, drop, playerRotation} from './movePlayer';
// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
	// console.log(createStage());

	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);

	const {player, updatePlayerPos, resetPlayer, playerRotate} = usePlayer();
	const {stage, setStage, rowsCleared} = useStage(player, resetPlayer);
	const {score, setScore, rows, setRows, level, setLevel} = useGameStatus(
		rowsCleared
	);



	

	const startGame = () => {
		// Reset everything
		setStage(createStage());
		setDropTime(1000);
		resetPlayer();
		setGameOver(false);
		setScore(0);
		setRows(0);
		setLevel(0);
	};

	

	const keyUp = ({ keyCode }) => {
		if (!gameOver) {
			if (keyCode === 40) {
				setDropTime(1000 / (level + 1) + 200);
				console.log('Interval on: 1000');
			}
		}
	};



	const move = ({ keyCode }) => {
		if (!gameOver) {
			// 37 = left arrow, -1 on x axis
			// 39 = right arrow, +1 on x axis
			// 40 = down arrow
			// 38 = up arrow, rotate

			if (keyCode === 37) {
				movePlayer(-1, updatePlayerPos, player, stage);
			} else if (keyCode === 39) {
				movePlayer(1, updatePlayerPos, player, stage);
			} else if (keyCode === 40) {
				dropPlayer(setDropTime, drop, rows, level, player, stage, setLevel, updatePlayerPos, setGameOver);
			} else if (keyCode === 38) {
				playerRotation(stage, 1, playerRotate);
			}
		}
	};

	useInterval(() => {
		drop(rows, level, player, stage, setLevel, setDropTime, updatePlayerPos, setGameOver);
	}, dropTime);

	return (
		<StyledTetrisWrapper
			role="button"
			tabIndex="0"
			onKeyDown={(e) => move(e)}
			onKeyUp={keyUp}
		>
			<StyledTetris>
				<Stage stage={stage} />
				<aside>
					{gameOver ? (
						<Display id="gameOverDisplay" gameOver={gameOver} text="Game Over" />
					) : (
						<div id="test">
							<Display id="scoreDisplay" text={`Score: ${score}`} />
							<Display id="rowDisplay" text={`Rows: ${rows}`} />
							<Display id="levelDisplay" text={`Level: ${level}`} />
						</div>
					)}
					<StartButton callback={startGame} />
				</aside>
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Tetris;
