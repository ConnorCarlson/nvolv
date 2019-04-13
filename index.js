let express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json())

let PORT = 8080;

// app.get("");

app.post("/like", (req, res) => {
    console.log(req.body)
    res.send("Done");
});

app.listen(PORT, () => console.log(`Server on port ${PORT}`))

