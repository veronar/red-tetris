import React from 'react';

import { StyledStartButton } from './styles/StyledStartButton';

const StartButton = ({ callback }) => (
	<StyledStartButton id="startButton" onClick={callback}>Start Game</StyledStartButton>
);

export default StartButton;
