import React, { Component } from 'react';
import NavBar from './components/NavBar.js';
import Feed from './components/Feed.js';
import Upload from './components/Upload';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

class App extends Component {
	
	render() {
		return (
			<HashRouter>
				<NavBar style={{ marginBottom: '25px' }}></NavBar>
				<Route path="/" exact component={Feed}/>
				<Route path="/upload" component={Upload} />
				<Route path="/signin" component={UserSignIn} />
				<Route path="/signup" component={UserSignUp} />
			</HashRouter>
		);
	}
}

export default App;
