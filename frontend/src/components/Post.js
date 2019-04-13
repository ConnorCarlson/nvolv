import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

// takes props:
// user
// image
class Post extends Component {
    render() {
        return (
            <Card>
                <p>{this.props.user}</p>
                <CardImg src={this.props.image}></CardImg>
            </Card>
        );
    }
}

export default Post;
