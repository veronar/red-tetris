import React from 'react';
import { useSelector } from 'react-redux';
import Tetris from '../components/Tetris';
import TopBar from '../components/TopBar';
import {
	BrowserRouter as Router,
	useParams,
	Route,
} from "react-router-dom";
import userSocket from '../helpers/socket';

let mainSocket = null

const App = () => {
	const message = useSelector((state) => state.message);
	return (
		<Router>
			<Route path="/:room?">
				<Test />
			</Route>
		</Router>
	)
};

function Test() {
	let { room } = useParams()
	if (!mainSocket)
		mainSocket = userSocket(room);
	return <div className="App">
		<Tetris />
	</div>
}
export default App;
