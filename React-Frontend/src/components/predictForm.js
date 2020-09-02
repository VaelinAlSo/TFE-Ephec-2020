/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from "clsx";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuSearch from "./menuSearch";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DuoIcon from "@material-ui/icons/Duo";
import ExplicitIcon from "@material-ui/icons/Explicit";
import Button from "@material-ui/core/Button";
import NavTabs from "./navtabs";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import FavoriteIcon from "@material-ui/icons/Favorite";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import { Link, Redirect } from "react-router-dom";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { predict } from "../http-calls/http-predictions";
import { getMoviesSamples } from "../http-calls/http-get-movies-12xx";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function PredictForm() {
  const [redirectRes, setRedirectRes] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loadedScreen, setLoadedScreen] = React.useState(false);

  const [predictions, setPredictions] = React.useState([]);
  const [movieFields, setMovieFields] = React.useState({});

  const [studio, setStudio] = React.useState("");
  const [code, setCode] = React.useState("");
  const [budget, setBudget] = React.useState("10000000");
  const [duration, setDuration] = React.useState("02:00");
  const [date, setDate] = React.useState("2020-09-03");
  const [genres, setGenres] = React.useState([]);  //"");

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const timer = React.useRef();

  const classes = useStyles();
  const [values, setValues] = React.useState({
    textmask: "(1  )    -    ",
    numberformat: "1000000",
  });
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  React.useEffect( () => {
    let token = localStorage.getItem("JWTtoken");

    if (token != null) {

      if (token != null && localStorage.getItem("moviesSamples")==null) {
        // console.log("calling getMoviesSamples")
        localStorage.setItem("moviesSamples","[]") // avoid calling twice
        getMoviesSamples().then(()=>{
          moviesSamplesStatic = JSON.parse(localStorage.getItem("moviesSamples"));
          setLoggedIn(true);  
         // console.log('moviesSamplesStatic after getMoviesSamples', moviesSamplesStatic)
          setLoadedScreen(true);
        });
      } else {
        setLoggedIn(true);  
        setLoadedScreen(true);
      }
    } else {
      setLoggedIn(false);  
      setLoadedScreen(true);
    }



    return () => {
      clearTimeout(timer.current);
    };
  });

  
  const studiosStatic = JSON.parse(localStorage.getItem("studios"));

  const genresStatic = JSON.parse(localStorage.getItem("genres"));

  const classification = JSON.parse(localStorage.getItem("codes"));

  let moviesSamplesStatic = JSON.parse(localStorage.getItem("moviesSamples"));


  const handlePredictClicked = () => {
    let year = date.substring(0, 4);
    let durationSpl = duration.split(":");
    let durationMin = parseInt(durationSpl[0]) * 60 + parseInt(durationSpl[1]);

    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
    //TODO  : validate if all the required fiels have been given

    let genresForBackend = genres.map(genre=> {
      if (typeof genre == 'string') {
        return genre
      } else {
        return genre.title
      }
    })

    let fields = {
      Year: year,
      Duration2: durationMin,
      DurationPatched: "0",
      Budget: budget == "" ? "1000000" : budget,
      Genres: genresForBackend.join(' '),
      Code: code,
      Studio: studio,
    };

    predict(fields)
      .then((response) => {
        //  console.log('predict response', response)
        let predictionsHttp = response.map((p) => {
          var resLine = [];
          resLine.push(
            (p.algo == "NN" ? "Neural Network" : (p.algo == "LR" ? "Linear Regression" : "Real BoxOffice")) +
              " " +
              p.catData
          );
          resLine.push(parseFloat(p.value.toPrecision(4)));
          //      console.log('resLine', resLine)
          return resLine;
        });
        //  console.log("predictions", predictionsHttp)
        setPredictions(predictionsHttp);
        setMovieFields(fields);
        setRedirectRes(true);
      })
      .catch((e) => {

        console.log(e);

        let token = localStorage.getItem("JWTtoken");

        if (token == null) {
          console.log('token cleaned in http-comp because expired')
          setLoggedIn(false);
        } else {
          setOpen(true);
          setSuccess(false);
          setLoading(false);
          setStudio("");
          setCode("");
          setGenres([]);
        }
      });

    //  only after setRedirect(true) ... and info passed through  first "div"
  };

  /*
  <blockquote>
  <h2>Debug movie fields</h2>
    <h3>{studio}</h3>
    <h3>{code}</h3>
    <h3>{budget}</h3>
    <h3>{duration}</h3>
    <h3>{date}</h3>
    <h3>{genres}</h3>
  </blockquote>
*/

  return (
    <div>
      {redirectRes && (
        <Redirect
          to={{
            pathname: "/Prediction",
            state: {
              predictions: { predictions },
              movieFields: movieFields,
            },
          }}
        />
      )}

      {loadedScreen && !loggedIn && (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )}
      {loadedScreen && loggedIn && (
        <React.Fragment>
          <MenuSearch></MenuSearch>
          
          <div>
            <br></br>
            <Grid container spacing={1}>
              <Grid item xs={1} align="center"></Grid>
              <Grid item xs={8} align="left">
                <Autocomplete
                  id="movies-sample"
                  options={moviesSamplesStatic}
                  getOptionLabel={(option) =>
                    option.title + " (" + option.year + ")"
                  }
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Movies Samples"
                      variant="outlined"
                    />
                  )}
                  onChange={(event, newValue) => {
                    console.log("movies-samples newValue", newValue);
                    if (newValue == null) {
                      return;
                    }
                    setBudget(newValue.budget);
                    setCode(newValue.code);
                    setDate(newValue.date);
                    const minDuration = newValue.duration % 60;
                    const hourDuration = (newValue.duration - minDuration) / 60;
                   /*
                    console.log(
                      "new duration hourDuration minDuration" +
                        hourDuration +
                        "\t" +
                        minDuration
                    );
                    */
                    setDuration(
                      (hourDuration < 10 ? "0" : "") +
                        hourDuration +
                        ":" +
                        (minDuration < 10 ? "0" : "") +
                        minDuration
                    );
                    setStudio(newValue.studio);
                    let newGenresArr = newValue.genres
                    if (typeof newGenresArr == "string") {
                      // difference between localhost  and cloud ... for JSON types ?
                      newGenresArr = JSON.parse(newGenresArr)
                    }
                    setGenres(
                      newGenresArr.map((genre) => {
                        let titled = { title: genre };
                        return titled;
                      })
                    );
                  }}
                />
              </Grid>
            </Grid>
          </div>

          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <form className={classes.root} noValidate autoComplete="off">
                <div style={{ width: 350 }}>
                  <br></br>
                  <div className={classes.root}>
                    <Snackbar
                      open={open}
                      autoHideDuration={6000}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                      <Alert onClose={handleClose} severity="error">
                        Prediction has failed please refill the input fields and
                        try again
                      </Alert>
                    </Snackbar>
                  </div>
                  <h2> Pick the main features of your movie right here !</h2>
                  <Autocomplete
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DuoIcon />
                        </InputAdornment>
                      ),
                    }}
                    freeSolo
                    id="studio-field"
                    disableClearable
                    value={studio}
                    onChange={(event, newValue) => {
                      setStudio(newValue);
                    }}
                    options={studiosStatic}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Studio"
                        margin="normal"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <DuoIcon />
                            </InputAdornment>
                          ),
                          type: "search",
                        }}
                      />
                    )}
                  />
                  <Autocomplete
                    freeSolo
                    id="code-field"
                    onChange={(e) => setCode(e.target.value)}
                    disableClearable
                    value={code}
                    onChange={(event, newValue) => {
                      setCode(newValue);
                    }}
                    options={classification.map((option) => option.title)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="classification"
                        margin="normal"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <ExplicitIcon />
                            </InputAdornment>
                          ),
                          type: "search",
                        }}
                      />
                    )}
                  />

                  <TextField
                    label="Budget"
                    // value={values.numberformat}
                    name="numberformat"
                    value={budget}
                    margin="normal"
                    fullWidth
                    onChange={(event) => {
                      setValues({
                        ...values,
                        [event.target.name]: event.target.value,
                      });
                      //                    console.log("budget change",  event.target.value)
                      setBudget(event.target.value);
                    }}
                    className={clsx(classes.margin, classes.textField)}
                    id="budget-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountBalanceIcon />
                        </InputAdornment>
                      ),
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                  <TextField
                    id="duration-field"
                    label="Duration"
                    type="time"
                    margin="normal"
                    onChange={(e) => 
                      { //console.log('duration onChange '+e.target.value)
                        setDuration(e.target.value)}}
                   // defaultValue={duration}
                    value = {duration}
                    fullWidth
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">min</InputAdornment>
                      ),
                      step: 300, // 5 min
                    }}
                  />

                  <TextField
                    id="date-field"
                    label="Release date"
                    type="date"
                    margin="normal"
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    //defaultValue={date}
                    value={date}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Autocomplete
                    multiple
                    id="genres-field"
                    options={genresStatic}
                    value={genres}
                    onChange={(event, newValue) => {
                       console.log('genres onChange newValue',newValue);
                      // new value is an array of e.g {title: "Adventure"}
                      //setGenres(newValue.join(" "))
                      setGenres(newValue)
                    }}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Genres"
                        margin="normal"
                      ></TextField>
                    )}
                  />
                  <br></br>
                  <div className={classes.wrapper}>
                    <Button
                      variant="contained"
                      color="primary"
                      margin="normal"
                      disabled={loading}
                      fullWidth
                      className={classes.button}
                      onClick={handlePredictClicked}
                    >
                      Launch my prediction
                    </Button>
                    {loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </div>
              </form>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </div>
  );
}

const top100Films = [
  { title: "Walt Disney" },
  { title: "Warner Bros." },
  { title: "20th century Fox" },
  { title: "Miramax" },
  { title: "Sony Pictures" },
];
