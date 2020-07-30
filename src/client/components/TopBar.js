import React from 'react';
import {
	Toolbar,
	Typography,
	AppBar,
	Button,
	IconButton,
} from '@material-ui/core';
import { MenuIcon } from '@material-ui/icons/Menu';

const TopBar = () => (
	<AppBar position="static">
		<Toolbar color="secondary">
			<IconButton edge="start" color="inherit" aria-label="menu">
				<MenuIcon />
			</IconButton>
			<Button color="inherit">Login</Button>
			<Typography>Red Tetris</Typography>
		</Toolbar>
	</AppBar>
);

export default TopBar;
