let admin = require("firebase-admin");
let functions = require('firebase-functions');

let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nvolv-project.firebaseio.com"
});

let db = admin.firestore();


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