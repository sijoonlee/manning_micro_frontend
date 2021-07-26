const express = require("express");


const app = express();

app.use("/mfe/music", express.static("./music/build"));
app.use("/mfe/welcome", express.static("./welcome/dist"));
app.use("/", express.static("./bootstrap/dist"));

// app.all('/*', function(req, res) {
//     res.sendFile('index.html', { root: './bootstrap/dist'});
// });

app.listen(3001, () => {
    console.log("Web Server running at: http://localhost:3001")
    console.log("http://localhost:3001/hello")
    console.log("http://localhost:3001/play")
});
