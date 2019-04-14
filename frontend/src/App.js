import React, { Component } from 'react';
import NavBar from './components/NavBar.js';
import Feed from './components/Feed.js';
class App extends Component {
	render() {
		return (
			<div>
				<NavBar style={{marginBottom: '25px'}}></NavBar>
				<Feed></Feed>
			</div>
		);
	}
}

export default App;
