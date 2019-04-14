import React, { Component } from 'react';
import Post from './Post';
import { Spinner } from 'reactstrap';
import { Button } from 'reactstrap';
import firebase from 'firebase';
import 'firebase/firestore';
import Upload from './Upload';


class Feed extends Component {
	constructor() {
		super();
		this.state = {
			posts: null
		}
	}

	componentDidMount() {
		firebase.firestore().collection("posts").get().then((querySnapshots) => {
			let posts = [];
			querySnapshots.forEach((doc) => {
				posts.push(doc.data());
			});
			console.log(posts);
			this.setState({
				posts: posts 
			});
		});
	}

	render() {
		return (
			<div>
				{
					this.state.posts &&
					(this.state.posts.map(function (item, i) {
						return (<Post user={item.user} image={item.image} likes={item.likes} key={i}></Post>);
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
