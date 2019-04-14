import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

import LikeButton from './LikeButton';
import LikeCounter from './LikeCounter';

const postStyle = {
    width: '50vw',
    margin: 'auto',
    marginBottom: '25px' 
};

// takes props:
// user
// image
class Post extends Component {
    render() {
        return (
            <Card style={postStyle}>
                <CardBody>
                    <CardTitle>{this.props.user}</CardTitle>
                    <CardImg src={this.props.image}></CardImg>
                    <LikeButton></LikeButton>
                    <LikeCounter likes={this.props.likes}></LikeCounter>
                </CardBody>
            </Card>
        );
    }
}

export default Post;
