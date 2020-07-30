
import Enzyme, { shallow, render, mount} from "enzyme";
import React, { Component } from "react";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import * as gameHelpers from "../client/helpers/gameHelpers";
import Tetris from "../client/components/Tetris";

import {act} from 'react-dom/test-utils';


Enzyme.configure({ adapter: new Adapter() });
describe("test tetris", () => {
	it("should do something", () => {
		jest.useFakeTimers();
      const createStageSpy = jest.spyOn(gameHelpers, "createStage")
	  const wrapper = mount(<Tetris />);
	  wrapper.find("#startButton button").simulate("click");
	  expect(createStageSpy).toHaveBeenCalled()
	  const scoreDisplay = wrapper.find("#scoreDisplay div");
	  const rowDisplay = wrapper.find("#rowDisplay div");
	  const levelDisplay = wrapper.find("#levelDisplay div");
	  expect(scoreDisplay.text()).toEqual("Score: 0")
	  expect(rowDisplay.text()).toEqual("Rows: 0")
	  expect(levelDisplay.text()).toEqual("Level: 0")
	  wrapper.simulate("keydown", {keycode: 37})
	  wrapper.simulate("keyup", {keycode: 37})
	  wrapper.simulate("keydown", {keycode: 38})
	  wrapper.simulate("keyup", {keycode: 38})
	  wrapper.simulate("keydown", {keycode: 39})
	  wrapper.simulate("keyup", {keycode: 39})
	  wrapper.simulate("keydown", {keycode: 40})
	  act(() =>{
		  jest.advanceTimersByTime(100000);
		  wrapper.update()
		})
		wrapper.simulate("keyup", {keycode: 40})
		const gameOverDisplay = wrapper.find("#gameOverDisplay div");
		expect(gameOverDisplay.text()).toEqual("Game Over")
	
    });
  });
