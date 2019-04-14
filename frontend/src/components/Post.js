import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

import LikeButton from './LikeButton';

const postStyle = {
    width: '50vw',
    margin: 'auto',
    marginBottom: '25px' 
};

class Post extends Component {

    render() {
        return (
            <Card style={postStyle}>
                <CardBody>
                    <CardTitle>{this.props.user}</CardTitle>
                    <CardImg src={this.props.image}></CardImg>
                    <CardTitle>{this.props.title}</CardTitle>
                    <CardSubtitle>{this.props.desc}</CardSubtitle>
                    <CardText></CardText>
                    <LikeButton postID={this.props.postID} lowerBalance={this.props.lower} balance={this.props.balance} likes={this.props.likes}></LikeButton>
                </CardBody>
            </Card>
        );
    }
}

export default Post;
