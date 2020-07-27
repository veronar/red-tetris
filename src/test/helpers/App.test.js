import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../client/containers/app';
import * as redux from 'react-redux'
import Enzyme, { shallow, render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import * as components from '../../client/components/allComponents'

Enzyme.configure({ adapter: new Adapter() })
it('renders correctly enzyme', () => {
	const spy = jest.spyOn(redux, 'useSelector')
	spy.mockReturnValue('Soon, will be here a fantastic Tetris ...')
	const wrapper = shallow(<App />)
	expect(toJson(wrapper)).toMatchSnapshot();
  });
describe("tests components render properly",() =>{
	Object.keys(components).map(component =>{
		const Component = component
		it(`tests ${component}`, () =>{
			const wrapper = shallow(<Component />)
			expect(toJson(wrapper)).toMatchSnapshot();
		})
	})
})