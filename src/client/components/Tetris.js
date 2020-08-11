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

const Game = require('../../server/models/Game').Game;
let newGame = new Game();

let mainSocket = null;

const Tetris = (props) => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(null);
	const [host, setHost] = useState(false)
	const [user, setUser] = useState(null)
	const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
	const { stage, setStage, rowsCleared, addRow } = useStage(player, resetPlayer, mainSocket);
	const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(
		rowsCleared
	);

	const startGame = () => {
		// Reset everything
		setStage(createStage());
		setDropTime(1000);
		resetPlayer();
		setGameOver(false);
		newGame.left = [...newGame.users]
		setWinner(null)
		setScore(0);
		setRows(0);
		setLevel(1);
	};

	useEffect(() => {
		console.log(newGame)
		let test = props.room.split('[')
		newGame.room = test[0][0] === '#' ? test[0].substr(1) : test[0]
		const connect = async () => {
			mainSocket = await userSocket(props.room);
			mainSocket.off('updateUsers')
			mainSocket.off('addRow')
			mainSocket.off('startiguess')
			mainSocket.off('deadUser')
			mainSocket.off('setWinner')
			mainSocket.on('updateUsers', (t) => {
				newGame.users = t
				if (newGame.users[0].id === mainSocket.id)
					setHost(true)
				setUser(newGame.users.find(e => e.id === mainSocket.id))
			})
			mainSocket.on('startiguess', () => {
				mainSocket.emit('updatePlayer', stage)
				newGame.left = [...newGame.users]
				startGame()
				newGame.start = true;
			})
			mainSocket.on('deadUser', (id) => {
				newGame.left.splice(newGame.left.findIndex(e => e.id === id), 1)
				if (newGame.left.length === 1) {
					setGameOver(true)
					setDropTime(null)
					mainSocket.emit('winner', newGame.left[0])
				}
			})
			mainSocket.on('setWinner', (nickname) => {
				newGame.start = false;
				mainSocket.emit('updatePlayer', stage)
				setWinner(nickname)
			})
		}
		connect()
	}, [])

	const callStartGame = () => {
		mainSocket.emit('start?', newGame.room)
		newGame.start = true;
	}

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
				dropPlayer(setDropTime, drop, rows, level, player, stage, setLevel, updatePlayerPos, setGameOver, mainSocket);
			} else if (keyCode === 38) {
				playerRotation(stage, 1, playerRotate);
			}
		}
	};

	useInterval(() => {
		mainSocket.on('addRow', () => {
			addRow(stage)
			updatePlayerPos({ x: 0, y: 0, collided: false })
		})
		drop(rows, level, player, stage, setLevel, setDropTime, updatePlayerPos, setGameOver, mainSocket);
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
					{winner ? (<Display id="winnerDisplay" text={`Winner: ${winner}`} />) : ''}
					{gameOver ? (
						<Display id="gameOverDisplay" gameOver={gameOver} text="Game Over" />
					) : (
							<div id="test">
								{user ? (<Display id="nicknameDisplay" text={`Name: ${user.nickname}`} />) : ''}
								<Display id="scoreDisplay" text={`Score: ${score}`} />
								<Display id="rowDisplay" text={`Rows: ${rows}`} />
								<Display id="levelDisplay" text={`Level: ${level}`} />
								<Display id="leftDisplay" text={`Left: ${newGame.left.length}`} />
							</div>
						)}
					{newGame.start
						? ''
						: (host
							? <StartButton callback={callStartGame} />
							: <p>Waiting for host</p>
						)
					}
				</aside>{
					!gameOver ?
						<div id="stageContainer">
							{newGame.left ? (newGame.users.map((value, index) => {
								if (value.board && value.id !== mainSocket.id && newGame.left.find(e => e.id === value.id))
									return <div key={index} style={{ width: "5vw", padding: "0 10px" }}><p>{value.nickname}</p><Stage type={1} stage={value.board} /></div>
							})) : ''}
						</div> : ''
				}
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Tetris;
