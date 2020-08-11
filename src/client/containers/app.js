import React from 'react';
import { useSelector } from 'react-redux';
import Tetris from '../components/Tetris';
import TopBar from '../components/TopBar';
import {
	BrowserRouter as Router,
	Route,
} from "react-router-dom";

const App = () => {
	const message = useSelector((state) => state.message);
	const Test = () => {
		let room = window.location.href.split('/')[3];
		if (room[0])
			room = room.substr(1);
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
