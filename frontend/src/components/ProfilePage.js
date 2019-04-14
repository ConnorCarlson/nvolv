import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup } from 'reactstrap';



export default class ProfilePage extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            photoUrl: null,
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
                console.log(this.state.user);
                firebase.firestore().collection("users").doc(this.state.user.uid).get().then((doc) => {
                    if (doc.exists) {
                        console.log("Document data:", doc.data());
                        this.setState({
                            photoUrl: doc.data().photoUrl,
                            username: doc.data().username,
                            bio: doc.data().bio,
                            balance: doc.data().balance
                        })
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
        firebase.firestore().collection("users").doc(this.state.user.uid).set({
            username: this.state.username,
            bio: this.state.bio
        }, {merge: true}).then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    // amount {int} - int value to change
    // add  {boolean} - true or false (to withdraw)
    updateBalance(amount, add) {
        console.log(amount);
        console.log(amount + this.state.balance)
        if(add) {
            // no verifications.. for now
            this.setState({balanceToAdd: 0});
        } else {
            this.setState({balanceToWithdraw: 0});
            amount = amount * -1;
            if(this.state.balance - amount > 0) {
                console.log("Error: can't withdraw more than current balance");
                return;
            }
        }

        this.setState({balance: this.state.balance + amount});

        firebase.firestore().collection("users").doc(this.state.user.uid).set({
            balance: this.state.balance
        }, {merge: true}).then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    } 

    render() {
        return (
            <div>
                <Form style={{width: '80vw', margin: "auto"}}>
                <h2 style={{marginTop: '25px'}}>Edit Profile</h2>
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
							{this.state.picUrl && <div>
								<h2 style={{ marginTop: '1rem' }}>Cropped Picture</h2>
								<p className="lead">Click update to finalize your cropped picture!</p>
								<img src={this.state.picUrl} width="200" alt="cropped"></img>
							</div>}
							<FormText color="muted">
								Update your profile picture here!
          			        </FormText>
							<img src={this.state.photoUrl} alt="profile" width="200" height="auto"></img>
						</FormGroup>  


                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" disabled name="email" id="exampleEmail" onChange={(event) => this.updateValue("email", event.target.value)} value={this.state.email} placeholder="Email" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="exampleUsername" onChange={(event) => this.updateValue("username", event.target.value)} value={this.state.username} placeholder="username" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="exampleDescription" onChange={(event) => this.updateValue("bio", event.target.value)} value={this.state.bio} placeholder="description" />
                    </FormGroup>                    
                    
                    
                    <Button onClick={this.saveProfile}>Save</Button>
                    <h2 style={{marginTop: '25px'}}>Manage Balance</h2>

                    <p>Current Balance: {this.state.balance}</p>
                    <FormGroup>
                        <Label for="addBalance">Add Balance</Label>
                        <InputGroup>
                            <Input type="number" name="email" id="exampleEmail" onChange={(event) => this.updateValue("balanceToAdd", event.target.value)} value={this.state.balanceToAdd} placeholder="0" />
                            <Button onClick={()=> this.updateBalance(parseInt(this.state.balanceToAdd), true)}>Add</Button>
                        </InputGroup>
                    </FormGroup>


                    <FormGroup>
                        <Label for="withdrawBalance">Withdraw Balance</Label>
                        <InputGroup>
                            <Input type="number" name="email" id="exampleEmail" onChange={(event) => this.updateValue("balanceToWithdraw", event.target.value)} value={this.state.balanceToWithdraw} placeholder="0" />
                            <Button onClick={()=> this.updateBalance(parseInt(this.state.balanceToWithdraw), false)}>Withdraw</Button>
                        </InputGroup>
                    </FormGroup>


                </Form>
            </div>
        );
    }
}
