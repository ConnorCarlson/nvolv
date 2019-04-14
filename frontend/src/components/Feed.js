import React, { Component } from 'react';
import Post from './Post';
import { Button, Spinner } from 'reactstrap';
import firebase from 'firebase';
import 'firebase/firestore';


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
					this.state.posts ?
						(this.state.posts.map(function (item, i) {
							return (<Post user={item.user} image={item.image} likes={item.likes} key={i}></Post>);
						}))
						:
						<div style={{ textAlign: 'center', margin: '40vh' }}>
							<Spinner></Spinner>
						</div>
				}
				<div className='text-center'>
					<Button color='primary'>Show More</Button>
				</div>
			</div>
		);
	}
}

export default Feed;
