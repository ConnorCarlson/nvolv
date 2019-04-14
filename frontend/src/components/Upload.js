import React, { Component } from 'react';
import { Input, FormGroup, Form, Label, Button, FormText } from 'reactstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default class Upload extends Component {

    constructor() {
        super();
        this.state = {
            dataUrl: null,
            profilePic: null,
            showLoader: false,
            crop: {
                width: 50,
                x: 0,
                y: 0
            }
        }
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

    onCropComplete = (crop, pixelCrop) => {
        this.setState({ actualCrop: pixelCrop });
    };

    cropChange = (crop) => {
        this.setState({ crop });
    }

    toggleLoader = () => {
        this.setState({ showLoader: !this.state.showLoader });
    }

    render() {
        return (
            <div>
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
            </div>
        );
    }

}