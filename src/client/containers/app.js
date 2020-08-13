import React from 'react';
import Tetris from '../components/Tetris';
import {
	BrowserRouter as Router,
	Route,
} from "react-router-dom";

const App = () => {
	const Test = () => {
		let room = window.location.href.split('/')[3];
		return <div className="App">
			<Tetris room={room} />
		</div>
	}
	return (
		<Router>
			<Route path="/:room?" component={Test} />
		</Router>
	)
};

export default App;
