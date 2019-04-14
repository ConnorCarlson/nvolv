import React, { Component } from 'react';
import NavBar from './components/NavBar.js';
import Feed from './components/Feed.js';
import Upload from './components/Upload';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import ProfilePage from './components/ProfilePage';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';

class App extends Component {

	render() {
		return (
			<HashRouter>
				<NavBar style={{ marginBottom: '25px', position: 'fixed' }}></NavBar>
				<Switch>
					<Route path="/" exact component={Feed} />
					<Route path="/upload" component={Upload} />
					<Route path="/signin" component={UserSignIn} />
					<Route path="/signup" component={UserSignUp} />
					<Route path="/profile" component={ProfilePage} />
					<Redirect to="/" />
				</Switch>
			</HashRouter>
		);
	}
}

export default App;
