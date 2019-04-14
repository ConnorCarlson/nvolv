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
        console.log(data);
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
        <Button color="danger" onClick={this.toggle}>Like</Button>
        <p>Liked by {this.state.likes} people.</p>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Like this post?</ModalHeader>
          <ModalBody>
            Are you sure you want to like this photo?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.doLike}>Confirm</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default LikeButton;