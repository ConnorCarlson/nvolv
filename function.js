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
    //update the liker user balance
    let userRef = db.collection("users").doc(userID);
    db.runTransaction(t => {
        return t.get(userRef)
          .then(doc => {
            let newBalance = doc.data().balance - 1;
            t.update(userRef, {balance: newBalance});
          });
      }).then(result => {
        res.send('Transaction success!');
      }).catch(err => {
        res.send('Transaction failure:', err);
      });
      
      //update poster balance
      let postRef = db.collection('posts').doc(postID);
      postRef.get()
      .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            postUserRef = db.collection("users").doc(doc.data().userID);
            db.runTransaction(t => {
                return t.get(postUserRef)
                .then(doc => {
                    let newBalance = doc.data().balance + 1;
                    t.update(postUserRef, {balance: newBalance});
                });
            }).then(result => {
                res.send('Transaction success!');
            }).catch(err => {
                res.send('Transaction failure:', err);
            });
            getPostUser = doc.data().userID;
            console.log('Document data:', doc.data());
        }
      })
      .catch(err => {
        res.send('Error getting document', err);
      });

      // update post likes
      db.runTransaction(t => {
        return t.get(postRef)
          .then(doc => {
            let newLikes = doc.data().likes + 1;
            t.update(postRef, {likes: newLikes});
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