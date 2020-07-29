import * as gameHelpers from "../client/helpers/gameHelpers";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "../client/containers/App";
import * as redux from "react-redux";
import Enzyme, { shallow, render, mount } from "enzyme";
import { renderHook, act } from "@testing-library/react-hooks";
// import { act } from 'react-dom/test-utils';
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import * as propComponents from "../client/components/propComponents";
import * as tetrominos from "../client/helpers/tetrominos";
import { usePlayer } from "../client/hooks/usePlayer";
import { useStage } from "../client/hooks/useStage";
import Tetris from "../client/components/Tetris";
import { useInterval } from "../client/hooks/useInterval";
import { useGameStatus } from "../client/hooks/useGameStatus";
Enzyme.configure({ adapter: new Adapter() });
describe("Testing Tetris hooks", () => {
	const clearStage = Array.from(Array(gameHelpers.STAGE_HEIGHT), () =>
		new Array(gameHelpers.STAGE_WIDTH).fill([0, "clear"])
	);
	let player;
	let stage;
	let gameStatus;
	let results;
	let result;
	beforeAll(() => {
		result = renderHook(usePlayer).result;
		act(() => {
			result.current.resetPlayer();
		});
		player = result.current;
		result = renderHook(() => useStage(player.player, player.resetPlayer))
			.result;
		stage = result.current;
		result = renderHook(() => useGameStatus(stage.rowsCleared));
		gameStatus = result.current;
	});

	describe("test usePlayer", () => {
		it("should rotate player", () => {
			const { result } = renderHook(usePlayer);

			const checkCollisionSpy = jest
				.spyOn(tetrominos, "randomTetromino")
				.mockImplementation(() => {
					return tetrominos.TETROMINOS["J"];
				});
			act(() => {
				result.current.resetPlayer();
			});
			let initPlayer = { ...result.current.player };
			act(() => {
				result.current.playerRotate(stage.stage, 1);
			});
			expect(result.current.player.tetromino).not.toEqual(initPlayer.tetromino);
		});
		it("should not rotate player", () => {
			const { result } = renderHook(usePlayer);
			const checkCollisionSpy = jest
				.spyOn(gameHelpers, "checkCollision")
				.mockImplementation(() => {
					return true;
				});
			let initPlayer = { ...result.current.player };
			act(() => {
				result.current.playerRotate(stage.stage, 1);
			});
			expect(checkCollisionSpy).toHaveBeenCalled();
			expect(result.current.player.tetromino).toEqual(initPlayer.tetromino);
		});
		it("should not rotate player", () => {
			const { result } = renderHook(usePlayer);
			let initPlayer;
			act(() => {
				result.current.resetPlayer();
			});
			initPlayer = { ...result.current.player };
			act(() => {
				result.current.updatePlayerPos({ x: 0, y: 0, collided: true });
			});
			initPlayer.pos.x += 0;
			initPlayer.pos.y += 0;
			initPlayer.collided = true;
			expect(initPlayer).toEqual(result.current.player);
		});
	});

	// describe("test useStage", () => {
	// 	it("should do something", () => {
	// 		const playerStage = renderHook(usePlayer).result
	// 		const { result } = renderHook(() => useStage(playerStage.current.player, playerStage.current.resetPlayer));
	// 		const resetPl = jest.spyOn(playerStage.current, "resetPlayer")
	// 		console.log (result.current.rowsCleared);
	// 		act(() => {
	// 			playerStage.current.resetPlayer();
	// 		})
	// 		act(() => {
	// 			playerStage.current.updatePlayerPos({x:0, y:0, collided: true})
	// 		})
	// 		console.log (result.current.rowsCleared);
	// 		expect(resetPl).toHaveBeenCalledTimes(2)
	// 		// act(() =>{

	// 		// })
	// 	});
	// });
});
