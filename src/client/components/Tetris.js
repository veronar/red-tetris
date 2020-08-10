import React, { useState, useEffect } from 'react';

import { createStage, checkCollision } from '../helpers/gameHelpers';
import userSocket from "../helpers/socket";

// Styled Component
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import { movePlayer, dropPlayer, drop, playerRotation } from './movePlayer';
// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

let mainSocket = null;
let users = [];
let start = false;
let room = null;

const Tetris = (props) => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [host, setHost] = useState(false)
	const [user, setUser] = useState(null)
	const [tot, setTot] = useState(0)
	const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
	const { stage, setStage, rowsCleared, addRow } = useStage(player, resetPlayer, mainSocket);
	const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(
		rowsCleared
	);

	useEffect(() => {
		let test = props.room.split('[')
		room = test[0][0] == '#' ? test[0].substr(1) : test[0]
		const connect = async () => {
			mainSocket = await userSocket(props.room);
			mainSocket.off('updateUsers')
			mainSocket.off('addRow')
			mainSocket.off('startiguess')
			mainSocket.on('updateUsers', (t) => {
				users = t
				if (users[0].id == mainSocket.id)
					setHost(true)
				setUser(users.find(e => e.id == mainSocket.id))
				setTot(users.length)
			})
			mainSocket.on('addRow', () => {
				addRow(stage)
				updatePlayerPos({ x: 0, y: 0, collided: false })
			})
			mainSocket.on('startiguess', () => {
				startGame()
			})
			// mainSocket.on('endgame', () => {
			// 	setGameOver(true)
			// 	setDropTime(null)
			// })
		}
		connect()
	}, [])

	const callStartGame = () => {
		mainSocket.emit('start?', room)
		start = true;
	}

	const startGame = () => {
		// Reset everything
		setStage(createStage());
		setDropTime(1000);
		resetPlayer();
		setGameOver(false);
		setScore(0);
		setRows(0);
		setLevel(1);
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
								{user ? (<Display id="nicknameDisplay" text={`Name: ${user.nickname}`} />) : ''}
								<Display id="scoreDisplay" text={`Score: ${score}`} />
								<Display id="rowDisplay" text={`Rows: ${rows}`} />
								<Display id="levelDisplay" text={`Level: ${level}`} />
								<Display id="totalDisplay" text={`Total: ${tot}`} />
							</div>
						)}
					{host ? (<StartButton callback={callStartGame} />) : (<p>Waiting for host</p>)}
				</aside>
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Tetris;
