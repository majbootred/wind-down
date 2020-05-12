const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const path = require("path");
const app = express();
const port = 443;
app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

var https_options = {
  key: fs.readFileSync("certificates/privkey.pem"),

  cert: fs.readFileSync("certificates/cert.pem"),

  ca: [
    fs.readFileSync("certificates/chain.pem"),

    fs.readFileSync("certificates/fullchain.pem"),
  ],
};

app.listen(port, () => console.log("Server is up"));

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end("Hello Node.js Server with HTTPS");
};

const server = https.createServer(https_options, app);

server.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on ${port}`);
});
