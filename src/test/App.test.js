import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from '../client/containers/App';
import * as redux from 'react-redux'
import Enzyme, { shallow, render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import * as components from '../client/components/allComponents';
import { Tetris } from '../client/components/Test';


Enzyme.configure({ adapter: new Adapter() })
it('renders correctly enzyme', () => {
	const spy = jest.spyOn(redux, 'useSelector')
	spy.mockReturnValue('Soon, will be here a fantastic Tetris ...')
	const wrapper = mount(<App />)
	expect(toJson(wrapper)).toMatchSnapshot();
  });
//   Object.keys(components).forEach(componentName => {
// 	const Component = components[componentName];
// 	describe(`Component: ${componentName}`, () => {
// 	  test(`${componentName} renders with default props`, () => {
// 		const wrapper = shallow(<Component />);
// 		expect(wrapper).toMatchSnapshot();
// 	  });
// 	});
//   }); 
  