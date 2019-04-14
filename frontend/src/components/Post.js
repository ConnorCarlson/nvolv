import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import LikeButton from './LikeButton';

class Post extends Component {

    constructor() {
        super();
        this.state = {
            pfpUrl: null
        }
    }

    componentDidMount() {
        firebase.firestore().collection("users").doc(this.props.userID).get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    pfpUrl: doc.data().photoURL,
                })
            } else {
                console.log("No such document!");
            }
        });
    }

    getDate(timestamp) {
        let options = {
            hour: 'numeric',
            minute: 'numeric'
        }
        let date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", options);
    }
    render() {
        return (
            <Card className="responsive-card">
                <CardBody>
                    <div style={{marginBottom: '1rem'}}>
                        {this.state.pfpUrl &&
                            <img alt="profile pic" src={this.state.pfpUrl} style={{width: '3rem', borderRadius: '50%', display: 'inline', marginRight: '1rem'}}></img>
                            
                        }
                        <p style={{display: 'inline'}}>{this.props.user}</p>
                        <p style={{display: 'inline', textAlign: 'right', position: "absolute", right: '1rem', color: 'grey'}}>{this.getDate(this.props.timestamp)}</p>
                    </div>
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
