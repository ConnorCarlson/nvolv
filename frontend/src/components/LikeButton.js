import React, { Component } from 'react';
import { Button } from 'reactstrap';

// takes props:
// user
class LikeButton extends Component {
    render() {
        return (
            <Button>
                Like
            </Button>
        );
    }
}

export default LikeButton;
