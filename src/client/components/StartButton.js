import React from 'react';
import { Button, Typography } from '@material-ui/core';

import { StyledStartButton } from './styles/StyledStartButton';

const StartButton = ({ callback }) => (
	<Button
		variant="contained"
		color="warning"
		id="startButton"
		onClick={callback}
		fullWidth="true"
	>
		{/* <StyledStartButton id="startButton" onClick={callback}> */}
		<Typography>START GAME</Typography>
		{/* </StyledStartButton> */}
	</Button>
);

export default StartButton;
