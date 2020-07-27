export const STAGE_WIDTH = 12; // PDF says width must be 10, change later
export const STAGE_HEIGHT = 20;

export const createStage = () =>
	Array.from(Array(STAGE_HEIGHT), () =>
		new Array(STAGE_WIDTH).fill([0, 'clear'])
	);
