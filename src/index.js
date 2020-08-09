import React from 'react'
import ReactDom from 'react-dom'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import reducer from './client/reducers'
import App from './client/containers/app'
import { alert } from './client/actions/alert';
import 'fontsource-roboto';
// import userSocket from './client/helpers/socket'

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const initialState = {}

// userSocket()

const store = createStore(
	reducer,
	initialState,
	composeEnhancer(applyMiddleware(thunk, createLogger()))
)

ReactDom.render((
	<Provider store={store}>
		<App />
	</Provider>
), document.getElementById('tetris'))

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'))
