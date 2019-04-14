import React, { Component } from 'react';
import { Input, FormGroup, Form, Label, Button, FormText, Spinner } from 'reactstrap';
import ReactCrop from 'react-image-crop';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'react-image-crop/dist/ReactCrop.css';
import DetectUser from './DetectUser';
import $ from 'jquery';

export default class Upload extends Component {

    constructor() {
        super();
        this.state = {
            dataUrl: null,
            loading: false,
            profilePic: null,
            showLoader: false,
            actualCrop: {
                width: 50,
                x: 0,
                y: 0,
            },
            crop: {
                width: 50,
                x: 0,
                y: 0
            },
            title: "",
            desc: ""
        }
    }

    updateValue = (name, value) => {
        this.setState({
            [name]: value
        })
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
        }).then((array) => this.setState({ file: array[0], picUrl: array[1], dataUrl: null }));
    }

    onImageLoaded = (image, pixelCrop) => {
        this.imageRef = image;
    }

    onCropComplete = (crop, pixelCrop) => {
        this.setState({ actualCrop: pixelCrop });
    };

    cropChange = (crop) => {
        this.setState({ crop });
    }

    toggleLoader = () => {
        this.setState({ showLoader: !this.state.showLoader });
    }

    uploadImage = () => {
        this.setState({
            loading: true
        });
        let { file, desc, title } = this.state;
        let { uid, displayName } = firebase.auth().currentUser;
        let fileRef = firebase.storage().ref(`posts/${uid + file.name}`);
        fileRef.put(file).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((url) => {
                $.post({
                    url: '/post',
                    method: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        desc: desc,
                        photo: url,
                        title: title,
                        user: displayName,
                        userid: uid
                    }),
                    contentType: 'application/json',
                    success: data => {
                        console.log(data);
                        window.location.hash = "#/";
                    }
                })
                // firebase.database().ref(`userData/${user.uid}`).child('data/photoUrl').set(url);
                // this.setState({ confirm: "Information successfully updated!", photoURL: updateInfo.photoURL, picUrl: null });
                // this.toggleLoader();
            });
        })
    }

    render() {
        return (
            <div>
                <DetectUser />
                {this.state.loading
                    ?
                    <div style={{ textAlign: 'center', margin: '40vh' }}>
                        <Spinner></Spinner>
                    </div>
                    :
                    <div>
                        <FormGroup>
                            <Label for="displayName">Title</Label>
                            <Input type="displayName" name="displayName" value={this.state.title} onChange={(event) => this.updateValue("title", event.target.value)} id="title" placeholder="Your Title" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleText">Description (max 300 characters!)</Label>
                            <Input type="textarea" maxLength="300" value={this.state.desc} onChange={(event) => this.updateValue("desc", event.target.value)} name="text" id="exampleText" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleFile">Your Picture</Label>
                            <Input type="file" name="file" accept=".jpg,.png,.jpeg,.gif" onChange={(event) => {
                                var reader = new FileReader();
                                reader.addEventListener("load", () => {
                                    this.setState({
                                        dataUrl: reader.result
                                    })
                                }, false);
                                reader.readAsDataURL(event.target.files[0]);
                                this.setState({ file: event.target.files[0], picUrl: null })
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
                                Crop your post here!
                      </FormText>
                            {this.state.photoURL &&
                                <div>
                                    <img src={this.state.photoURL} alt="profile" width="200" height="auto"></img>
                                </div>}
                            <Button onClick={this.uploadImage}>Upload</Button>
                        </FormGroup>
                    </div>
                }
            </div>
        );
    }

}