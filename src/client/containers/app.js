import React from 'react';
import { useSelector } from 'react-redux';
import Tetris from '../components/Tetris';

const App = () => {
	const message = useSelector((state) => state.message);
	var msg = (
		<div className="App">
			<Tetris />
		</div>
	);
	return <span>{msg}</span>;
};
export default App;
