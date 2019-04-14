import React, { Component } from 'react';
import Post from './Post';
import { Spinner } from 'reactstrap';
import { Button } from 'reactstrap';


class Feed extends Component {
	constructor() {
		super();
		this.state = {
			posts: [{ user: "test", image: "./download.jpg" }, { user: "test2", image: "./download.jpg" }, { user: "test3", image: "./download.jpg" }]
		};
	}


	render() {
		return (
			<div>
				{
					this.state.posts &&
					(this.state.posts.map(function (item, i) {
						return (<Post user={item.user} image={item.image} key={i}></Post>);
					}))
				}
				<div className='text-center'>
					<Button color='primary'>Show More</Button>
				</div>
			</div>
		);
	}
}

export default Feed;
