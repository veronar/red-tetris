import React, { useState, useEffect, useCallback } from "react";

import { createStage, checkCollision } from "../helpers/gameHelpers";
import { userSocket, socketOff, socketOn, socketEmit } from "../middleware/socket";

// Styled Component
import { StyledTetrisWrapper, StyledTetris } from "./styles/StyledTetris";

// Custom Hooks
import { useInterval } from "../hooks/useInterval";
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useGameStatus } from "../hooks/useGameStatus";
import { movePlayer, dropPlayer, drop, playerRotation } from "./movePlayer";
// Components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
import { TETROMINOS } from "../helpers/tetrominos";

let newGame = {
	users: [],
	left: [],
	room: null,
};

let mainSocket = null;

const Tetris = (props) => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(null);
	const [host, setHost] = useState(false);
	const [shapes, setShapes] = useState(null);
	const [user, setUser] = useState(null);
	const [start, setStart] = useState(false);
	const [shapeTrack, setShapeTrack] = useState(0);
	const {
		player,
		updatePlayerPos,
		resetPlayer,
		playerRotate,
		playerFall,
		setPlayer,
		rotate,
	} = usePlayer(setShapeTrack, TETROMINOS);
	const { stage, setStage, rowsCleared, addRow } = useStage(
		player,
		resetPlayer,
		mainSocket,
		shapes,
		shapeTrack,
		setPlayer
	);
	const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(
		rowsCleared
	);
	const startGame = useCallback(
		(
			setStart,
			setStage,
			setDropTime,
			resetPlayer,
			setGameOver,
			newGame,
			setWinner,
			setScore,
			setRows,
			setLevel
		) => {
			// Reset everything
			setStart(true);
			setStage(createStage());
			setDropTime(1000);
			resetPlayer(shapes, shapeTrack, setPlayer);
			setGameOver(false);
			newGame.left = [...newGame.users];
			setWinner(null);
			setScore(0);
			setRows(0);
			setLevel(1);
		},
		// eslint-disable-next-line
		[resetPlayer, setLevel, setRows, setScore, setStage, shapes]
	);

	useEffect(() => {
		if (shapes) {
			startGame(
				setStart,
				setStage,
				setDropTime,
				resetPlayer,
				setGameOver,
				newGame,
				setWinner,
				setScore,
				setRows,
				setLevel
			);
		}
		// eslint-disable-next-line
	}, [shapes, startGame]);
	useEffect(() => {
		if (gameOver) setShapeTrack(0);
	}, [gameOver, shapeTrack, setShapeTrack]);
	const connect = useCallback(
		async (
			userSocket,
			newGame,
			setHost,
			setUser,
			setShapes,
			setWinner,
			setGameOver,
			setDropTime,
			setStart
		) => {
			if (!mainSocket) {
				let test = props.room.split("[");
				newGame.room = test[0][0] === "#" ? test[0].substr(1) : test[0];
				mainSocket = await userSocket(props.room);
				socketOff(mainSocket, "updateUsers")
				socketOff(mainSocket, "updateUsers");
				socketOff(mainSocket, "addRow");
				socketOff(mainSocket, "startiguess");
				socketOff(mainSocket, "deadUser");
				socketOff(mainSocket, "setWinner");
				/*
				** updateUsers sets the array of users in the newGame object to the received players. This contains the player nickname, id, and board.
				** The newGame.users array is used to display the enemy boards and nicknames on the side. It's also used to display how many are left.
				*/
				socketOn(mainSocket, "updateUsers", (t) => {
					newGame.users = t;
					if (newGame.users[0] && newGame.users[0].id === mainSocket.id)
						setHost(true);
					setUser(newGame.users.find((e) => e.id === mainSocket.id));
				});
				/*
				** startiguess updates the users's board in the beginning and if the host (first user in the array) it generates shapes using the
				** receive shapes emit function.
				*/
				socketOn(mainSocket, "startiguess", (r) => {
					socketEmit(mainSocket, "updatePlayer", stage);
					if (newGame.users[0] && newGame.users[0].id === mainSocket.id)
						socketEmit(mainSocket, "receive shapes", r);
				});
				/*
				** After shapes have been generated, receive shapes calls setShapes with the received shapes for everyone to use.
				*/
				socketOn(mainSocket, "receive shapes", (shapes1) => {
					setShapes(shapes1);
				});
				/*
				** deadUser removes the user from the newGame.left array. This array contains all the players still left in the game. After removing 
				** the user, it checks to see if there is only 1 player left. If there is only 1 left, that player is the winner and we call the winner
				** emit.
				*/
				socketOn(mainSocket, "deadUser", (id) => {
					newGame.left.splice(
						newGame.left.findIndex((e) => e.id === id),
						1
					);
					if (newGame.left.length === 1) {
						setGameOver(true);
						setDropTime(null);
						socketEmit(mainSocket, "winner", newGame.left[0]);
					}
				});
				/*
				** setWinner just updates the text in one of the boxes to the winners name so everyone in the room can see who won the match.
				*/
				socketOn(mainSocket, "setWinner", (nickname) => {
					setStart(false);
					socketEmit(mainSocket, "updatePlayer", stage);
					setWinner(nickname);
				});
			}
		},
		[props.room, stage]
	);

	const useMountEffect = (
		fun,
		userSocket,
		newGame,
		setHost,
		setUser,
		setShapes,
		setWinner,
		setGameOver,
		setDropTime,
		setStart
	) =>
		useEffect(() => {
			fun(
				userSocket,
				newGame,
				setHost,
				setUser,
				setShapes,
				setWinner,
				setGameOver,
				setDropTime,
				setStart
			);
			// eslint-disable-next-line
		}, []);

	const callStartGame = (mainSocket, setStart, newGame) => {
		/*
		** When the start button is clicked, start? is emitted which starts the game for everyone else
		*/
		socketEmit(mainSocket,"start?", newGame.room);
		setStart(true);
	};

	const keyUp = ({ keyCode }, gameOver, setDropTime, level) => {
		if (!gameOver) {
			if (keyCode === 40) {
				setDropTime(1000 / (level + 1) + 200);
			}
		}
	};

	const move = (
		{ keyCode },
		movePlayer,
		dropPlayer,
		setDropTime,
		drop,
		rows,
		level,
		player,
		stage,
		setLevel,
		updatePlayerPos,
		setGameOver,
		mainSocket,
		start,
		setStart,
		playerRotation,
		playerRotate,
		gameOver,
		setPlayer
	) => {
		if (!gameOver) {
			// 37 = left arrow, -1 on x axis
			// 39 = right arrow, +1 on x axis
			// 40 = down arrow
			// 38 = up arrow, rotate
			if (keyCode === 32) {
				playerFall(stage, player, checkCollision, setPlayer);
			}
			if (keyCode === 37) {
				movePlayer(-1, updatePlayerPos, player, stage, setPlayer);
			} else if (keyCode === 39) {
				movePlayer(1, updatePlayerPos, player, stage, setPlayer);
			} else if (keyCode === 40) {
				dropPlayer(
					setDropTime,
					drop,
					rows,
					level,
					player,
					stage,
					setLevel,
					updatePlayerPos,
					setGameOver,
					mainSocket,
					start,
					setStart,
					setPlayer
				);
			} else if (keyCode === 38) {
				playerRotation(
					stage,
					1,
					playerRotate,
					checkCollision,
					rotate,
					player,
					setPlayer
				);
			}
		}
	};

	useInterval(
		(mainSocket, addRow, updatePlayerPos) => {
			/*
			** When another player clears a row, clearRow is called. clearRow then emits addRow to all the other player.
			** addRow calls a function called addRow which moves all current blocks up by 1 and adds the solid layer at the bottom.
			*/
			socketOn( mainSocket,
				"addRow",
				() => {
					addRow(stage, setStage);
					updatePlayerPos({ x: 0, y: 0, collided: false }, setPlayer);
				},
				mainSocket,
				addRow,
				updatePlayerPos
			);
			drop(
				rows,
				level,
				player,
				stage,
				setLevel,
				setDropTime,
				updatePlayerPos,
				setGameOver,
				mainSocket,
				start,
				setStart,
				setPlayer
			);
		},
		mainSocket,
		addRow,
		updatePlayerPos,
		dropTime
	);
	useMountEffect(
		connect,
		userSocket,
		newGame,
		setHost,
		setUser,
		setShapes,
		setWinner,
		setGameOver,
		setDropTime,
		setStart
	);

	return (
		<StyledTetrisWrapper
			role="button"
			tabIndex="0"
			onKeyDown={(e) =>
				move(
					e,
					movePlayer,
					dropPlayer,
					setDropTime,
					drop,
					rows,
					level,
					player,
					stage,
					setLevel,
					updatePlayerPos,
					setGameOver,
					mainSocket,
					start,
					setStart,
					playerRotation,
					playerRotate,
					gameOver,
					setPlayer
				)
			}
			onKeyUp={(e) => keyUp(e, gameOver, setDropTime, level)}
		>
			<StyledTetris>
				<Stage stage={stage} />
				<aside>
					{winner ? (
						<Display id="winnerDisplay" text={`Winner: ${winner}`} />
					) : (
						""
					)}
					{gameOver ? (
						<Display
							id="gameOverDisplay"
							gameOver={gameOver}
							text="Game Over"
						/>
					) : (
						<div id="test">
							{user ? (
								<Display id="nicknameDisplay" text={`Name: ${user.nickname}`} />
							) : (
								""
							)}
							<Display id="scoreDisplay" text={`Score: ${score}`} />
							<Display id="rowDisplay" text={`Rows: ${rows}`} />
							<Display id="levelDisplay" text={`Level: ${level}`} />
							<Display id="leftDisplay" text={`Left: ${newGame.left.length}`} />
						</div>
					)}
					{start ? (
						""
					) : host ? (
						<StartButton
							callback={callStartGame}
							mainSocket={mainSocket}
							setStart={setStart}
							newGame={newGame}
						/>
					) : (
						<p>Waiting for host</p>
					)}
				</aside>
				{!gameOver ? (
					<div id="stageContainer">
						{newGame.left
							? newGame.users.map((value, index) => {
									if (
										value.board &&
										value.id !== mainSocket.id &&
										newGame.left.find((e) => e.id === value.id)
									)
										return (
											<div key={index} style={{ padding: "0 10px" }}>
												<p>{value.nickname}</p>
												<Stage type={1} stage={value.board} />
											</div>
										);
									return null;
							  })
							: ""}
					</div>
				) : (
					""
				)}
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Tetris;
