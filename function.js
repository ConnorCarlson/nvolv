let admin = require("firebase-admin");
let functions = require('firebase-functions');

let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nvolv-project.firebaseio.com"
});

let db = admin.firestore();

// make like and update the balance of the user that likes
exports.makeLike = function(userID, postID, res) {
    let userRef = db.collection("users").doc(userID);
    db.runTransaction(t => {
        return t.get(userRef)
          .then(doc => {
            let newBalance = doc.data().balance - .1;
            t.update(userRef, {balance: newBalance});
          });
      }).then(result => {
        res.send('Transaction success!');
      }).catch(err => {
        res.send('Transaction failure:', err);
      });
    
      postUserRef = db.collection("users").doc(postID.get(userID));
      db.runTransaction(t => {
        return t.get(userRef)
          .then(doc => {
            let newBalance = doc.data().balance + .1;
            t.update(userRef, {balance: newBalance});
          });
      }).then(result => {
        res.send('Transaction success!');
      }).catch(err => {
        res.send('Transaction failure:', err);
      });
}



exports.deleteLike = function(userID, postID) {
    console.log(userID, postID)
}

exports.addBalance = function(userID, postID, amount, res) {
  let userRef = db.collection("users").doc(userID);
    db.runTransaction(t => {
        return t.get(userRef)
          .then(doc => {
            let newBalance = doc.data().balance + amount;
            t.update(userRef, {balance: newBalance});
          });
      }).then(result => {
        res.send('Transaction success!');
      }).catch(err => {
        res.send('Transaction failure:', err);
      });
}

exports.getLikes = function(postID) {
  let postRef = db.collection("post").doc(postID);
  let likeNumber = null;
  postRef.get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document')
    } else {
      likeNumber = doc.data().likes;
    }
  })
  return likeNumber;
}