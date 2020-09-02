const controllers = require("../controllers");

const uploadCSVController = controllers.uploadCSV;
const userController = controllers.user;
const fields = controllers.fieldsCollection;
const personController = controllers.person;
const predictControllers = controllers.proxyPredict;
const movieController = controllers.movie;

const authModule = require("../middleware/auth");
const auth = authModule.auth;
const auth0 = authModule.auth0;


module.exports = (app) => {
    app.get("/api", (req, res) =>
      res.status(200).send({
        message: "Welcome to TFE-Movies-backend",
      })
    );

    app.post("/api/upload", auth0, uploadCSVController.upload);

    app.post("/api/user", userController.createUser);
  
    app.post("/api/authenticate", userController.login);

    app.get("/api/genres", fields.getGenres);
    app.get("/api/codes", fields.getCodes);
    app.get("/api/studios", fields.getStudios);

    app.get("/api/persons", auth, personController.getPersons);

    app.post("/api/createFileOnTheFly", auth, personController.createFileOnTheFly);

    app.post("/api/ml/predict-12xx", auth, predictControllers.predict12xx);
    app.post("/api/ml/predict-65xx", auth, predictControllers.predict65xx);
    app.post("/api/movies/checkResult", auth, movieController.getMovieResult);

    app.get("/api/movies/12xx/nonTR", auth, movieController.getMovies);

  
};