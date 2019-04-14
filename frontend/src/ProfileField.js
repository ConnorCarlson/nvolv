import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import characterOptions from './CharacterOptions';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';

export default class ProfileField extends Component {

	constructor() {
		super();
		this.state = {
			ready: false,
			tag: null,
			email: null,
			profilePic: null,
			city: '',
			bio: '',
			twitter: '',
			confirm: null,
			error: null,
			main: '',
			secondary: '',
			friendCode: '',
			discord: '',
			showLoader: false,
			crop: {
				width: 50,
				x: 0,
				y: 0,
				aspect: 1
			}
		}
	}

	componentDidMount() {
		this.userRef = firebase.database().ref('userData').child(this.props.id).child('data');
		let fromDB;
		this.userRef.on("value", (snapshot) => {
			fromDB = snapshot.val();
			this.setState({
				tag: this.props.tag,
				photoURL: this.props.photoURL,
				email: this.props.email,
				bio: fromDB.bio,
				city: fromDB.city,
				twitter: fromDB.twitter,
				main: fromDB.main,
				ready: true,
				secondary: fromDB.secondary,
				discord: fromDB.discord,
				friendCode: fromDB.friendCode
			});
		})
	}

	componentWillUnmount() {
		this.userRef.off();
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

	onImageLoaded = (image, pixelCrop) => {
		this.imageRef = image;
	}

	updateInformation = () => {
		this.setState({
			error: null,
			confirm: null
		});
		if (/[0-9]{4}-[0-9]{4}-[0-9]{4}/g.test(this.state.friendCode) || this.state.friendCode === "") {
			let user = firebase.auth().currentUser;
			let updateInfo = {};
			if (this.state.tag !== this.props.displayName) {
				updateInfo.displayName = this.state.tag;
			}
			let data = {
				bio: this.state.bio,
				city: this.state.city,
				displayName: this.state.tag,
				twitter: this.state.twitter,
				discord: this.state.discord,
				main: this.state.main,
				secondary: this.state.secondary,
				friendCode: this.state.friendCode,
				photoUrl: this.state.photoURL,
			}
			this.toggleLoader();
			this.userRef.set(data)
				.then(() => {
					if (this.state.profilePic) {
						let profilePic = firebase.storage().ref(`images/${user.uid}.jpg`);
						profilePic.put(this.state.profilePic).then((snapshot) => {
							snapshot.ref.getDownloadURL().then((url) => {
								updateInfo.photoURL = url;
								user.updateProfile(
									updateInfo
								).then(() => {
									firebase.database().ref(`userData/${user.uid}`).child('data/photoUrl').set(updateInfo.photoURL);
									this.setState({ confirm: "Information successfully updated!", photoURL: updateInfo.photoURL, picUrl: null });
									this.toggleLoader();
								});
							});
						})
					} else {
						user.updateProfile(
							updateInfo
						).then(() => {
							this.setState({ confirm: "Information successfully updated!" });
							this.toggleLoader();
						});
					}
				})
				.catch((err) => this.setState({ error: err.message }));
		} else {
			this.setState({
				error: "Friend code does not match the format!"
			})
		}
	}

	toggleLoader = () => {
		this.setState({ showLoader: !this.state.showLoader });
	}

	updateValue = (name, value) => {
		this.setState({
			[name]: value
		})
	}

	cleanInput(value) {
		value = value.replace(/[^0-9-]/gi, '');
		this.setState({
			friendCode: value
		});
	}

	onCropComplete = (crop, pixelCrop) => {
		this.setState({ actualCrop: pixelCrop });
	};

	cropChange = (crop) => {
		this.setState({ crop });
	}

	render() {
		return (
			this.state.ready ?
				<React.Fragment>
					<h4 className="section-space">Player Details</h4>
					<Form>
						<FormGroup>
							<Label for="exampleEmail">Email</Label>
							<Input type="email" disabled name="email" id="exampleEmail" onChange={(event) => this.updateValue("email", event.target.value)} value={this.state.email} placeholder="Email" />
						</FormGroup>
					</Form>
					<Form inline>
						<FormGroup>
							<Label className="label-space" for="tag">Tag</Label>
							<Input className="label-space" type="tag" name="tag" id="tag" onChange={(event) => this.updateValue("tag", event.target.value)} value={this.state.tag} placeholder="Tag" />
						</FormGroup>
						<FormGroup>
							<Label className="label-space" for="exampleSelect">Main</Label>
							<Input className="label-space" type="select" value={this.state.main} onChange={(event) => this.updateValue("main", event.target.value)} name="select" id="exampleSelect">
								{characterOptions.map((character, i) => {
									return <option key={"character" + i}>{character}</option>
								})}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label className="label-space" for="secondarySelect">Secondary</Label>
							<Input className="label-space" type="select" value={this.state.secondary} onChange={(event) => this.updateValue("secondary", event.target.value)} name="select" id="secondarySelect">
								{characterOptions.map((character, i) => {
									return <option key={"character" + i}>{character}</option>
								})}
							</Input>
						</FormGroup>
					</Form>
					<Form inline className="form-space">
						<FormGroup>
							<Label className="label-space" for="friend-code">Friend Code</Label>
							<Input className="label-space" type="friend-code" name="friend-code" maxLength="14" required
								id="friendCode" onChange={(event) => {
									this.cleanInput(event.target.value);
								}} value={this.state.friendCode} placeholder="XXXX-XXXX-XXXX" />
						</FormGroup>
						<FormGroup>
							<Label className="label-space" for="city">City</Label>
							<Input className="label-space" type="city" value={this.state.city} onChange={(event) => this.updateValue("city", event.target.value)}></Input>
						</FormGroup>
					</Form>
					<h4 className="section-space">Social Media and Other Info</h4>
					<Form inline className="form-space">
						<FormGroup>
							<Label className="label-space" for="twitter">Twitter Handle</Label>
							<Input style={{ marginRight: '1rem' }} type="twitter" name="twitter" id="twitter" onChange={(event) => this.updateValue("twitter", event.target.value)} value={this.state.twitter} placeholder="Twitter" />
						</FormGroup>
						<FormGroup>
							<Label className="label-space" for="discord">Discord</Label>
							<Input type="discord" name="discord" id="discord" onChange={(event) => this.updateValue("discord", event.target.value)} value={this.state.discord} placeholder="Discord" />
						</FormGroup>
					</Form>
					<Form>
						<FormGroup>
							<Label for="exampleText">Bio (max 300 characters!)</Label>
							<Input type="textarea" maxLength="200" value={this.state.bio} onChange={(event) => this.updateValue("bio", event.target.value)} name="text" id="exampleText" />
						</FormGroup>
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
							<img src={this.state.photoURL} alt="profile" width="200" height="auto"></img>
						</FormGroup>
					</Form>
					<Button onClick={this.updateInformation}>Update</Button>
					{this.state.confirm && <Alert style={{ marginTop: '1rem' }} color="success">{this.state.confirm}</Alert>}
					{this.state.error && <Alert style={{ marginTop: '1rem' }} color="danger">{this.state.error}</Alert>}
					{this.state.showLoader && <img style={{ marginLeft: '1rem' }} alt="loading symbol" src={require("../assets/loader.gif")}></img>}
				</React.Fragment> :
				<div style={{ textAlign: 'center', margin: '5rem 0' }}>
					<img alt="loading symbol" src={require("../assets/loader.gif")}></img>
				</div>
		);
	}
}