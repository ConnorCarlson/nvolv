import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  doLike = () => {
    console.log("You liked it!");
    this.toggle();
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>Like</Button>
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