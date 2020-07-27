import { useState } from 'react';

import { createStage } from '../client/helpers/gameHelpers';

export const useStage = () => {
	const[stage, setStage] = useState(createStage());

	return [stage, setStage];
}
