import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup } from 'reactstrap';
import DetectUser from './DetectUser';

export default class ProfilePage extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            photoUrl: null,
            username: '',
            bio: '',
            confirm: null,
            error: null,
            showLoader: false,
            balanceToWithdraw: 0,
            balanceToAdd: 0,
            balance: 0,
            crop: {
                width: 50,
                x: 0,
                y: 0,
                aspect: 1
            }
        }
    }

    componentDidMount = () => {
        this.authUnregFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                this.setState({
                    user: firebaseUser
                })
                firebase.firestore().collection("users").doc(this.state.user.uid).get().then((doc) => {
                    if (doc.exists) {
                        console.log("Document data:", doc.data());
                        this.setState({
                            photoUrl: doc.data().photoURL || "",
                            username: doc.data().username || "",
                            bio: doc.data().bio || "",
                            balance: doc.data().balance || 0,
                            email: doc.data().email || ""
                        });
                    } else {
                        console.log("No such document!");
                    }
                });
            } else {
                this.setState({
                    user: null
                })
            }
        });
    }

    componentWillUnmount() {
        this.authUnregFunc();
    }

    getCroppedImg(image, pixelCrop, fileName) {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve([blob, this.fileUrl]);
            }, 'image/jpeg')
        }).then((array) => this.setState({ profilePic: array[0], picUrl: array[1], dataUrl: null }));
    }

    updateValue = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    onCropComplete = (crop, pixelCrop) => {
        this.setState({ actualCrop: pixelCrop });
    };

    cropChange = (crop) => {
        this.setState({ crop });
    }

    onImageLoaded = (image, pixelCrop) => {
        this.imageRef = image;
    }

    saveProfile = () => {
        console.log(this.state);
        firebase.firestore().collection("users").doc(this.state.user.uid).set({
            username: this.state.username,
            bio: this.state.bio,
            email: this.state.email
        }, { merge: true }).then(() => {
            if (this.state.profilePic) {
                let updateInfo = {};
                console.log(this.state.user);
                let profilePic = firebase.storage().ref(`posts/${this.state.user.uid}.jpg`);
                profilePic.put(this.state.profilePic).then((snapshot) => {
                    snapshot.ref.getDownloadURL().then((url) => {
                        updateInfo.photoURL = url;
                        console.log(updateInfo);
                        this.state.user.updateProfile(
                            updateInfo
                        ).then(() => {
                            firebase.firestore().collection("users").doc(this.state.user.uid).update({ photoURL: updateInfo.photoURL });
                            this.setState({ confirm: "Information successfully updated!", photoURL: updateInfo.photoURL, picUrl: null });
                        });
                    });
                })
            }
            console.log("Document successfully written!");
        })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

    // amount {int} - int value to change
    // add  {boolean} - true or false (to withdraw)
    updateBalance(amount, add) {
        if (add) {
            // no verifications.. for now
            this.setState({ balanceToAdd: 0 });
        } else {
            this.setState({ balanceToWithdraw: 0 });
            if (this.state.balance < amount) {
                console.log("Error: can't withdraw more than current balance");
                return;
            }
            amount = amount * -1;
        }

        let newBal = this.state.balance + amount;
        this.setState({ balance: this.state.balance + amount });

        firebase.firestore().collection("users").doc(this.state.user.uid).set({
            balance: newBal
        }, { merge: true }).then(() => {
            console.log("Document successfully written!" + this.state.balance + newBal);
        })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }

    render() {
        return (
            <div>
                <Form style={{ width: '80vw', margin: "auto", marginBottom: '3rem' }}>
                    <h2 style={{ marginTop: '25px' }}>Edit Profile</h2>
                    <DetectUser />
                    <FormGroup>
                        <Label for="exampleFile">Profile Picture</Label>
                        <Input type="file" name="file" accept=".jpg,.png,.jpeg,.gif" onChange={(event) => {
                            var reader = new FileReader();
                            reader.addEventListener("load", () => {
                                this.setState({
                                    dataUrl: reader.result
                                })
                            }, false);
                            reader.readAsDataURL(event.target.files[0]);
                            this.setState({ profilePic: event.target.files[0], picUrl: null })
                        }} id="exampleFile" />
                        {this.state.dataUrl &&
                            <React.Fragment>
                                <ReactCrop src={this.state.dataUrl} onImageLoaded={this.onImageLoaded} onComplete={this.onCropComplete} onChange={this.cropChange} crop={this.state.crop}></ReactCrop>
                                <div>
                                    <Button onClick={() => {
                                        this.getCroppedImg(this.imageRef, this.state.actualCrop, "newProfilePic.jpg");
                                    }}>Apply crop</Button>
                                </div>
                            </React.Fragment>}
                        {this.state.picUrl ?
                            <div>
                                <h2 style={{ marginTop: '1rem' }}>Cropped Picture</h2>
                                <p className="lead">Click update to finalize your cropped picture!</p>
                                <img src={this.state.picUrl} width="200" alt="cropped"></img>
                            </div>
                            :
                            <img src={this.state.photoUrl} alt="profile" width="200" height="auto"></img>
                        }
                        <FormText color="muted">
                            Update your profile picture here!
          			        </FormText>
                    </FormGroup>


                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" name="email" id="exampleEmail" onChange={(event) => this.updateValue("email", event.target.value)} value={this.state.email} placeholder="Email" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="exampleUsername" onChange={(event) => this.updateValue("username", event.target.value)} value={this.state.username} placeholder="Username" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Bio</Label>
                        <Input type="text" name="bio" id="exampleDescription" onChange={(event) => this.updateValue("bio", event.target.value)} value={this.state.bio} placeholder="Bio" />
                    </FormGroup>

                    <Button onClick={this.saveProfile}>Save</Button>
                    <h2 style={{ marginTop: '25px' }}>Manage Exposure Balance</h2>
                    <p>Current Balance: {this.state.balance}</p>
                    <FormGroup>
                        <Label for="addBalance">Add Exposure To Balance</Label>
                        <InputGroup>
                            <Input type="number" name="email" id="exampleEmail" onChange={(event) => this.updateValue("balanceToAdd", event.target.value)} value={this.state.balanceToAdd} placeholder="0" />
                            <Button onClick={() => this.updateBalance(parseInt(this.state.balanceToAdd), true)}>Add</Button>
                        </InputGroup>
                    </FormGroup>


                    <FormGroup>
                        <Label for="withdrawBalance">Redeem Exposure</Label>
                        <InputGroup>
                            <Input type="number" name="email" id="exampleEmail" onChange={(event) => this.updateValue("balanceToWithdraw", event.target.value)} value={this.state.balanceToWithdraw} placeholder="0" />
                            <Button onClick={()=> this.updateBalance(parseInt(this.state.balanceToWithdraw), false)}>Redeem</Button>
                        </InputGroup>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}
