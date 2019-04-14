import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

export default class DetectUser extends Component {

    constructor() {
        super();
        this.state = {
            redirect: false
        }
    }

    componentDidMount() {
        this.authUnregFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                this.setState({
                    redirect: false
                })
            } else {
                this.setState({
                    redirect: true
				});
            }
        });
    }

    componentWillUnmount() {
        this.authUnregFunc();
    }

    render() {
        return (
            <div>
                {this.state.redirect &&
                    <Redirect to="/signin"></Redirect>
                }
            </div>
        );
    }

}