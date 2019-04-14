import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';

class LikeButton extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			likes: this.props.likes
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}));
	}

	doLike = () => {
		let userID = firebase.auth().currentUser.uid;
		$.post({
			url: '/like',
			method: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				postid: this.props.postID,
				userid: userID
			}),
			contentType: 'application/json',
			success: data => {
				this.setState({
					likes: data.newLikes
				});
			}
		})
		this.toggle();
	}

	render() {
		return (
			<div>
				<Button color="danger" disabled={this.props.balance <= 0 ? true : false} title={this.props.balance < 0 ? "You don't have any exposure left!" : undefined} onClick={this.toggle}>EXP+</Button>
				<p style={{ marginTop: '0.5rem' }}>Liked by {this.state.likes} people.</p>
				<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
					{!firebase.auth().currentUser
						?
						<div>
							<ModalHeader toggle={this.toggle}>Spend exposure on this post?</ModalHeader>
							<ModalBody>
								<span>You are not signed in! Please sign in to spend exposure!</span>
								<ModalFooter style={{ marginTop: '1rem' }}>
									<Button color="secondary" onClick={this.toggle}>Cancel</Button>
								</ModalFooter>
							</ModalBody>
						</div>
						:
						<div>
							<ModalHeader toggle={this.toggle}>Spend exposure on this post?</ModalHeader>
							<ModalBody>
								Are you sure you want to spend exposure on this post?
          </ModalBody>
							<ModalFooter>
								<Button color="primary" onClick={this.doLike}>Confirm</Button>{' '}
								<Button color="secondary" onClick={this.toggle}>Cancel</Button>
							</ModalFooter>
						</div>}
				</Modal>
			</div>
		);
	}
}

export default LikeButton;