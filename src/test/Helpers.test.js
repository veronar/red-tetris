import * as gameHelpers from '../client/helpers/gameHelpers';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from '../client/containers/App';
import * as redux from 'react-redux'
import Enzyme, { shallow, render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import * as components from '../client/components/basicComponents';
import * as propComponents from '../client/components/propComponents';
import * as tetrominos from '../client/helpers/tetrominos';
import { usePlayer } from '../client/hooks/usePlayer';

Enzyme.configure({ adapter: new Adapter() })

describe("gamehelpers", () =>{
	const clearStage = Array.from(Array(gameHelpers.STAGE_HEIGHT), () => (new Array(gameHelpers.STAGE_WIDTH).fill([0, 'clear'])))
	let player = {pos: { x: 0, y: 0 }, tetromino: tetrominos.TETROMINOS['J'].shape, collided: false};
	it('Makes Stage', () => {
		const stage = gameHelpers.createStage();
		expect(stage).toEqual(clearStage)
	});
	it ("Generates Random shape" , () =>{
		const randomShape = tetrominos.randomTetromino()
		let result = false;
		Object.entries(tetrominos.TETROMINOS).map(([key, value]) => {
			if (randomShape === value){
				result = true;
			}
		})
		expect(result).toBeTruthy()
	})
	it("tests collision", () =>{
		expect(gameHelpers.checkCollision(player, clearStage, {x:0, y: 1})).toBeFalsy()
		expect(gameHelpers.checkCollision(player, clearStage, {x:0, y: 20})).toBeTruthy()
	})
});