import React from 'react';
import { Button, Typography } from '@material-ui/core';

import { StyledDisplay } from './styles/StyledDisplay';

const Display = ({ gameOver, text }) => {
	return (
		<StyledDisplay gameOver={gameOver}>
			<Typography>{text}</Typography>
		</StyledDisplay>
	);
};

export default Display;
