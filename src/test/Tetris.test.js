
import Enzyme, { shallow, render, mount} from "enzyme";
import React, { Component } from "react";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import * as gameHelpers from "../client/helpers/gameHelpers";
import Tetris from "../client/components/Tetris";

import {act} from 'react-dom/test-utils';
import * as move from "../client/components/movePlayer";
import { unmountComponentAtNode } from "react-dom";


Enzyme.configure({ adapter: new Adapter() });
describe("tests tetris", () => {
	let wrapper
	jest.useFakeTimers();
		beforeEach(() =>{
			 wrapper = mount(<Tetris />);
			 wrapper.find("#startButton button").simulate("click");
		})
		afterEach(() =>{
			wrapper.unmount();
		})
		// it("expect stage to be created", () =>{
		// 	const createStageSpy = jest.spyOn(gameHelpers, "createStage")
		// 	expect(createStageSpy).toHaveBeenCalled()
		// })
		it("display must be correct", () =>{
			const scoreDisplay = wrapper.find("#scoreDisplay p");
			const rowDisplay = wrapper.find("#rowDisplay p");
			const levelDisplay = wrapper.find("#levelDisplay p");
			expect(scoreDisplay.text()).toEqual("Score: 0")
			expect(rowDisplay.text()).toEqual("Rows: 0")
			expect(levelDisplay.text()).toEqual("Level: 0")
		})
		it("display game over must be correct", () =>{
			act(() =>{
				jest.advanceTimersByTime(100000);
				wrapper.update()
			})
			  const gameOverDisplay = wrapper.find("#gameOverDisplay p");
			  expect(gameOverDisplay.text()).toEqual("Game Over")
			})
			it("checks movement of player", () =>{
				const checkMovePlayer = jest.spyOn(move, "movePlayer")
				const checkDropPlayer = jest.spyOn(move, "dropPlayer")
				const checkRotatePlayer = jest.spyOn(move, "playerRotation")
				  wrapper.simulate("keyDown", {keyCode: 37})
				  wrapper.simulate("keyUp", {keycode: 37})
				  expect(checkMovePlayer).toHaveBeenCalledWith(-1, expect.any(Function), expect.any(Object), expect.any(Array))
				  wrapper.simulate("keyDown", {keyCode: 39})
				  wrapper.simulate("keyUp", {keycode: 39})
				  expect(checkMovePlayer).toHaveBeenCalledWith(1, expect.any(Function), expect.any(Object), expect.any(Array))
				  wrapper.simulate("keyDown", {keyCode: 40})
				  wrapper.simulate("keyUp", {keycode: 40})
				  expect(checkMovePlayer).toHaveBeenCalledTimes(2);
				  wrapper.simulate("keyDown", {keyCode: 38})
				  wrapper.simulate("keyUp", {keycode: 38})
				  expect(checkRotatePlayer).toHaveBeenCalledTimes(1)
			})
});

describe("tests tetris helpers", () =>{
	it("tests drop level increase and drop player if not collided", () =>{
		const mockUpdatePlayerPos = jest.fn()
		const checkCollisionSpy = jest.spyOn(gameHelpers, "checkCollision")
		.mockImplementation(() => {
			return false;
		});
		const mockSetLevel = jest.fn()
		const mockSetDropTime = jest.fn()
		move.drop(20, 0, [], [], mockSetLevel, mockSetDropTime, mockUpdatePlayerPos, []);
		expect(mockUpdatePlayerPos).toHaveBeenCalled();
		expect(mockSetLevel).toHaveBeenCalled();
		expect(mockSetDropTime).toHaveBeenCalled();
		
	})
	it("tests drop level increase and drop player if collided", () =>{
		const mockUpdatePlayerPos = jest.fn()
		const mockSetGameOver = jest.fn()
		jest.spyOn(gameHelpers, "checkCollision")
		.mockImplementation(() => {
			return true;
		});
		const mockSetLevel = jest.fn()
		const mockSetDropTime = jest.fn()
		move.drop(20, 2, {pos: {y:-1}}, [], mockSetLevel, mockSetDropTime, mockUpdatePlayerPos, mockSetGameOver);
		expect(mockSetGameOver).toHaveBeenCalledWith(true);
		expect(mockSetDropTime).toHaveBeenCalledWith(null);
		expect(mockUpdatePlayerPos).toHaveBeenCalledWith({ x: 0, y: 0, collided: true });
		
	})
	it("tests move player if player has collided", () =>{
		const mockUpdatePlayerPos = jest.fn()
		jest.spyOn(gameHelpers, "checkCollision")
		.mockImplementation(() => {
			return true;
		});
		move.movePlayer(1, mockUpdatePlayerPos, [], []);
		expect(mockUpdatePlayerPos).not.toHaveBeenCalled() 
	})
	it("tests rotate player", () =>{
		const mockUpdatePlayerPos = jest.fn()
		jest.spyOn(gameHelpers, "checkCollision")
		.mockImplementation(() => {
			return true;
		});
		move.movePlayer(1, mockUpdatePlayerPos, [], []);
		expect(mockUpdatePlayerPos).not.toHaveBeenCalled() 
	})
	
})