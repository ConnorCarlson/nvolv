let { makeLike, deleteLike, makePost, makeWithdraw, makeBalance, getLikes } = require('./function');

let express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());

let PORT = process.env.PORT || 8080;

process.env.NODE_ENV = "production";

//Static file declaration
app.use(express.static(path.join(__dirname, 'frontend/build')));

//production mode
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    //
    app.get('/', (req, res) => {
        res.sendfile(path.join(__dirname = 'frontend/build/index.html'));
    })
} else {
    //build mode
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/frontend/public/index.html'));
    });
}

app.route('/like')
    .get(function (req, res) {
        getLikes(req.body.postID, res)
    })
    .post(function (req, res) {
        makeLike(req.body.userid, req.body.postid, res)
    })

app.route('/userid')
    .get(function (req, res) {
        res.send('Get a User ID')
    })


app.route('/post')
    .get(function (req, res) {
        res.send('Get a Post ID')
    })
    .post(function (req, res) {
        makePost(req.body.desc, req.body.photo, req.body.title, req.body.user, req.body.userid, res)
    })

app.route('/balance')
    .get(function (req, res) {
        res.send('Get current balance')
    })
    .post(function (req, res) {
        res.send('Add balance')
        makeBalance(req.body.amount, req.body.userid, res)
    })

app.route('/withdraw')
    .post(function (req, res) {
        res.send('Withdraw monet')
        makeWithdraw(req.body.userid, req.body.amount, res)
    })

app.listen(PORT, () => console.log(`Server on port ${PORT}`))