import React, { useState, useEffect, useCallback } from 'react';

import { createStage } from '../helpers/gameHelpers';
import { userSocket } from "../helpers/socket";

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
	const [start, setStart] = useState(false)
	const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
	const { stage, setStage, rowsCleared, addRow } = useStage(player, resetPlayer, mainSocket);
	const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(
		rowsCleared
	);
	const startGame = useCallback(() => {
		// Reset everything
		setStart(true)
		setStage(createStage());
		setDropTime(1000);
		resetPlayer();
		setGameOver(false);
		newGame.left = [...newGame.users]
		setWinner(null)
		setScore(0);
		setRows(0);
		setLevel(1);
	}, [resetPlayer, setLevel, setRows, setScore, setStage]);


	const connect = useCallback(async () => {
		if (!mainSocket) {
			let test = props.room.split('[')
			newGame.room = test[0][0] === '#' ? test[0].substr(1) : test[0]
			mainSocket = await userSocket(props.room);
			mainSocket.off('updateUsers')
			mainSocket.off('addRow')
			mainSocket.off('startiguess')
			mainSocket.off('deadUser')
			mainSocket.off('setWinner')
			mainSocket.on('updateUsers', (t) => {
				newGame.users = t
				if (newGame.users[0] && newGame.users[0].id === mainSocket.id)
					setHost(true)
				setUser(newGame.users.find(e => e.id === mainSocket.id))
			})
			mainSocket.on('startiguess', () => {
				mainSocket.emit('updatePlayer', stage)
				startGame()
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
				setStart(false)
				mainSocket.emit('updatePlayer', stage)
				setWinner(nickname)
			})
		}
	}, [props.room, stage, startGame])

	// eslint-disable-next-line
	const useMountEffect = (fun) => useEffect(() => fun(), [])

	const callStartGame = () => {
		mainSocket.emit('start?', newGame.room)
		setStart(true)
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
				dropPlayer(setDropTime, drop, rows, level, player, stage, setLevel, updatePlayerPos, setGameOver, mainSocket, start, setStart);
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
		drop(rows, level, player, stage, setLevel, setDropTime, updatePlayerPos, setGameOver, mainSocket, start, setStart);
	}, dropTime);
	useMountEffect(connect);

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
					{start
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
									return <div key={index} style={{ padding: "0 10px" }}><p>{value.nickname}</p><Stage type={1} stage={value.board} /></div>
								return null
							})) : ''}
						</div> : ''
				}
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Tetris;
