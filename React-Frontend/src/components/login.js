import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MenuSearch from "./menuSearch";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import popcorn from "../assets/popcorn.png";
import PredictForm from "./predictForm";
import { Link, Redirect } from "react-router-dom";
import NavTabs from "./navtabs";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from "clsx";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { Authenticate } from "../http-calls/http-user";
import { getFieldsLists } from "../http-calls/http-movie-fields-lists";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Login() {
  const [redirectLoginOK, setRedirectLoginOK] = React.useState(false);
  const [redirectLogoutOK, setRedirectLogoutOK] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(
    localStorage.getItem("JWTtoken") != null
  );
  const [open, setOpen] = React.useState(false);

  const [values, setValues] = React.useState({
    login: "",
    password: "",
    showPassword: false,
  });

  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickLogout = () => {
    localStorage.removeItem("JWTtoken");
    setRedirectLogoutOK(true);
  };

  const handleLogin = (event) => {
    //console.log("start login with values"+values)
    Authenticate(values.login, values.password)
      .then(() => getFieldsLists())
      .then(() => {
        setValues({
          login: "",
          password: "",
        });
        setRedirectLoginOK(true);
      })
      .catch((error) => {
        console.log("error auth UI " + error);
        setValues({
          login: "",
          password: "",
          showPassword: false,
        });
        setOpen(true);
      });
  };

  return (
    <div className={classes.root}>
      {redirectLoginOK && <Redirect to="/predictForm" />}
      {redirectLogoutOK && <Redirect to="/" />}

      <MenuSearch></MenuSearch>
      <div className={classes.root}>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error">
            Authentication has failed
          </Alert>
        </Snackbar>
      </div>
      {loggedIn && (
        <div>
          <br></br>
          <br></br>
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <form>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleClickLogout}
                >
                  Logout
                </Button>
              </form>
            </Grid>
          </Grid>
          <br></br>
          <br></br>
        </div>
      )}

      {!loggedIn && (
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <div style={{ width: 350 }}>
              <br></br>
              <br></br>
              <br></br>
              <Grid item xs={4}>
                <AccountCircleIcon style={{ fontSize: 40 }} />
              </Grid>
              <br></br>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="filled"
              >
                <br></br>
                <TextField
                  label="Email Adress"
                  id="outlined-start-adornment"
                  margin="normal"
                  fullwidth
                  value={values.login}
                  onChange={handleChange("login")}
                  className={clsx(classes.margin, classes.textField)}
                />
                <br></br>
                <FormControl
                  className={clsx(classes.margin, classes.textField)}
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <br></br>
                <br></br>

                <Button
                  variant="contained"
                  color="secondary.light"
                  onClick={handleLogin}
                >
                  Login
                </Button>

                <br></br>
                <Link to="Signup">
                  <Button variant="contained" color="primary">
                    No account yet ? click here
                  </Button>
                </Link>
              </FormControl>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
