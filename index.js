let express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
let app = express();
app.use(bodyParser.json())

let PORT = 8080;

// app.get("");

app.route('/like')
    .get(function (req, res) {
    res.send('Number of likes')
    })
    .post(function (req, res) {
    res.send('Like EYYYYY')
    })

app.route('/UserID')
    .get(function (req, res) {
    res.send('Get a User ID')
    })
    .post(function (req, res) {
    res.send('Post User ID')
    })

app.listen(PORT, () => console.log(`Server on port ${PORT}`))

app.route('/PostID')
    .get(function (req, res) {
    res.send('Get a Post ID')
    })
    .post(function (req, res) {
    res.send('Post Post ID')
    })

app.route('/Balance')
    .get(function (req, res) {
    res.send('Get current balance')
    })
    .post(function (req, res) {
    res.send('Add balance')
    })






