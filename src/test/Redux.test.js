
 import {alert} from "../client/actions/alert"
 import {ping} from "../client/actions/server"
import reducer from "../client/reducers/alert"
 describe("testing actions", () =>{
	 it("testing alert", () => {
		 const message = alert('yes')
		 expect(message).toEqual({message: 'yes', type: "ALERT_POP"})
	 })
	 it("testing ping ", () =>{
		const result = ping();
		expect(result).toEqual({type: 'server/ping'})
	 })
})
describe("testing reducers", () =>{
	let result = reducer({}, {type: "ALERT_POP", message: 'yes'});
	expect(result).toEqual({message: 'yes'})
	result = reducer({}, {});
	expect(result).toEqual({})
})