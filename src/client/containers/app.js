import React from 'react';
import { useSelector } from 'react-redux';
import Tetris from '../components/Tetris';
import TopBar from '../components/TopBar';
import {
	BrowserRouter as Router,
	useParams,
	Route,
} from "react-router-dom";

const App = () => {
	const message = useSelector((state) => state.message);
	const Test = (props) => {
		let room;
		if (props.location.hash != '')
			room = props.location.hash;
		else
			room = props.location.pathname
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
