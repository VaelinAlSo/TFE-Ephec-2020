var express = require("express");

const PORT = 443;
const app = express();

const bodyParser = require("body-parser");
var createError = require("http-errors");
var cors = require("cors");
const expressOasGenerator = require("express-oas-generator");
expressOasGenerator.init(app, {});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(passport.initialize());

app.use(express.static('./public')); //Serves resources from public folder

var models = require("./models");

models.sequelize
  .sync()
  .then(function () {
    console.log("nice DB OK");
  })
  .catch(function (err) {
    console.log(err, "Db not ok");
  });
require("./server/routes")(app);

module.exports = app;

var server = app.listen(443, function () {
  console.log("TFE-Movies-backend ... on port %d", server.address().port);
});


// app.get("/", (req, res) => res.json({status: "TFE-Movies-backend"}));
