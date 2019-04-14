let admin = require("firebase-admin");
let functions = require('firebase-functions');

let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://nvolv-project.firebaseio.com"
});

let db = admin.firestore();

// make like and update the balance of the user that likes
exports.makeLike = function (userID, postID, res) {
    //update the liker user balance and posts user has liked
    let userRef = db.collection("users").doc(userID);
	db.runTransaction(t => {
		return t.get(userRef)
			.then(doc => {
                let newBalance = doc.data().balance - 1;
                let newArray = doc.data().postsLiked;
                newArray.push(postID);
                t.update(userRef, {postsLiked: newArray});
				t.update(userRef, { balance: newBalance });
			});
	}).then(result => {
		let postRef = db.collection('posts').doc(postID);
		// Get poster ID
		postRef.get()
			.then(doc => {
				if (!doc.exists) {
					res.send({ message: 'No such document!' });
				} else {
					postUserRef = db.collection("users").doc(doc.data().userID);
                    // Updating balance of poster
					db.runTransaction(t => {
						return t.get(postUserRef)
							.then(poster => {
								let newBalancePoster = poster.data().balance + 1;
								t.update(postUserRef, { balance: newBalancePoster });
							});
					}).then(doc => {
                        // update people who liked post
                        db.runTransaction(t => {
							return t.get(postRef)
								.then(doc => {
                                    let newArray = doc.data().userLikes;
                                    newArray.push(userID);
									t.update(postRef, { userLikes: newArray });
								});
						}).then(result => {
                            // Updating likes of post
                            db.runTransaction(t => {
                                return t.get(postRef)
                                    .then(doc => {
                                        let newLikes = doc.data().likes + 1;
                                        t.update(postRef, { likes: newLikes });
                                        return newLikes;
                                    });
                            }).then(result => {
                                res.send({ newLikes: result, message: 'Transaction success!' });
                            }).catch(err => {
                                res.send('Transaction failure 4:', err);
                            });
						}).catch(err => {
							res.send('Transaction failure 3:', err);
						});
						
					}).catch(err => {
						res.send({ message: 'Transaction failure: ', err });
					});
				}
			})
			.catch(err => {
				res.send('Error getting document', err);
			});
	}).catch(err => {
		res.send({ message: 'Transaction failure: ' + err });
	});
}

exports.addBalance = function (userID, postID, amount, res) {
	let userRef = db.collection("users").doc(userID);
	db.runTransaction(t => {
		return t.get(userRef)
			.then(doc => {
				let newBalance = doc.data().balance + amount;
				t.update(userRef, { balance: newBalance });
			});
	}).then(result => {
		res.send({ message: 'Transaction success!' });
	}).catch(err => {
		res.send({ message: 'Transaction failure:' + err });
	});
}

exports.getLikes = function (postID, res) {
	let postRef = db.collection("post").doc(postID);
	let likeNumber = null;
	postRef.get()
		.then(doc => {
			if (!doc.exists) {
				res.send({ message: 'No such document' })
			} else {
				likeNumber = doc.data().likes;
			}
		})
	return likeNumber;
}

exports.makePost = function (desc, image, title, user, userID, res) {
	db.collection("posts").add({
		desc: desc,
		image: image,
		likes: 0,
		postID: null,
		title: title,
		user: user,
        userID: userID,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
	})
		.then(ref => {
			let postRef = db.collection('posts').doc(ref.id);
			db.runTransaction(t => {
				return t.get(postRef)
					.then(doc => {
						let newID = ref.id;
						t.update(postRef, { postID: newID });
					});
			}).then(result => {
				res.send({ message: 'Transaction success!' });
			}).catch(err => {
				res.send({ message: 'Transaction failure:' + err });
			});
		}).catch(err => {
			res.send({ message: 'Creation fail:' + err });
		});
}

exports.makeWithdraw = function (userID, amount, res) {
	let userRef = db.collection("user").doc(userID);
	let newBalance = null;
	db.runTransaction(t => {
		return t.get(userRef)
			.then(doc => {
				newBalance = doc.data().balance - amount;
				t.update(userRef, { balance: newBalance });
			});
	}).then(result => {
		res.send({ message: 'Transaction success!' });
	}).catch(err => {
		res.send({ message: 'Transaction failure:' + err });
	});
	let postRef = db.collection("user").doc(userID);
}