let { makeLike, deleteLike } = require('./function');


let express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());

let PORT = 8080;

app.post("/like", (req, res) => {
    makeLike("DTOnv13ywZbBPL2Sx0cV", "pScgRGMjuwbCFJS4n1RM", res);
});

app.listen(PORT, () => console.log(`Server on port ${PORT}`))

