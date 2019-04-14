let { makeLike, deleteLike } = require('./function');


let express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
let app = express();
app.use(bodyParser.json());

let PORT = 8080;

<<<<<<< HEAD
app.post("/like", (req, res) => {
    makeLike("DTOnv13ywZbBPL2Sx0cV", "pScgRGMjuwbCFJS4n1RM", res);
});
=======
// app.get("");

app.route('/like')
    .get(function (req, res) {
    res.send('Number of likes')
    //req.query.numLikes
    })
    .post(function (req, res) {
    res.send('Like EYYYYY')
    makeLike(req.body.userid, req.body.postid)
    })

app.route('/userid')
    .get(function (req, res) {
    res.send('Get a User ID')
    })
>>>>>>> eec7f810fa23a4c0cd681d190497cb45d02efd63

app.listen(PORT, () => console.log(`Server on port ${PORT}`))

app.route('/postid')
    .get(function (req, res) {
    res.send('Get a Post ID')
    })
    .post(function (req, res) {
    res.send('Post Post ID')
    makePost(req.body.photo, req.body.userid, req.body.desc)
    })

app.route('/balance')
    .get(function (req, res) {
    res.send('Get current balance')
    })
    .post(function (req, res) {
    res.send('Add balance')
    makeBalance(req.body.amount, req.body.userid)
    })

app.route('/withdraw')
    .post(function (req, res) {
    res.send('Withdraw monet')
    makeWithdraw(req.body.userid, req.body.amount)
    })





