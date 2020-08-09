import React from 'react';
import { useSelector } from 'react-redux';
import Tetris from '../components/Tetris';
import TopBar from '../components/TopBar';
import userSocket from '../helpers/socket';

userSocket();

const App = () => {
	const message = useSelector((state) => state.message);
	var msg = (
		<div className="App">
			{/* <TopBar /> */}
			<Tetris />
		</div>
	);
	return <span>{msg}</span>;
};
export default App;
