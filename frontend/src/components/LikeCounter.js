import React, { Component } from 'react';


class Post extends Component {
    constructor() {
        super();
        this.state = {
            likes: 100
        };
    }
    
    render() {
        return (
            <p>Liked by {this.state.likes} people.</p>
        );
    }
}

export default Post;
