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
			let user = firebase.auth().currentUser;
			if (user) {
				firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(doc => {
					if (doc.exists) {
						this.setState({
							balance: doc.data().balance,
							posts: posts
						});
					}
				})
			} else {
				this.setState({
					posts: posts
				});
			}
		});
	}

	lowerBalance = () => {
		this.setState({
			balance: this.state.balance - 1
		});
	}

	render() {
		return (
			<div>
				{
					this.state.posts ?
						(this.state.posts.map((item, i) => {
							return (<Post user={item.user} postID={item.postID} lower={this.lowerBalance} balance={this.state.balance} image={item.image} likes={item.likes} desc={item.desc} title={item.title} key={i}></Post>);
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
