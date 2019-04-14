let { makeLike, deleteLike, makePost } = require('./function');


let express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
let app = express();
app.use(bodyParser.json());

let PORT = 8080;


app.route('/like')
    .get(function (req, res) {
    res.send('Number of likes')
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
    makeBalance(req.body.amount, req.body.userid)
    })

app.route('/withdraw')
    .post(function (req, res) {
    res.send('Withdraw monet')
    makeWithdraw(req.body.userid, req.body.amount)
    })

app.listen(PORT, () => console.log(`Server on port ${PORT}`))




