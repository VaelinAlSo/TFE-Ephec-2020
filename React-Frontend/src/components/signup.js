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

import { CreateUser } from "../http-calls/http-user";

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

export default function Signup() {
  const [redirect, setRedirect] = React.useState(false);
  const classes = useStyles();
  const [values, setValues] = React.useState({
    login: "",
    password1: "",
    showPassword1: false,
    password2: "",
    showPassword2: false,
    firstName: "",
    name: "",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword1 = () => {
    setValues({ ...values, showPassword1: !values.showPassword1 });
  };

  const handleClickShowPassword2 = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 });
  };

  const handleCreateUser = () => {
    if (values.password1 != values.password2) {
      alert("Passwords are not equal");
      return;
    }
    console.log("start createUser with values" + values);

    CreateUser(values.name, values.firstName, values.login, values.password1)
      .then(() => {
        setRedirect(true);
      })
      .catch((error) => {
        console.log("error auth UI " + error);
        alert("User creation has failed");
      });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={classes.root}>
      {redirect && <Redirect to="/login" />}

      <MenuSearch></MenuSearch>

      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <div style={{ width: 350 }}>
            <br></br>
            <br></br>
            <br></br>
            <Grid item xs={4}>
              <AccountCircleIcon style={{ fontSize: 40 }} />
            </Grid>
            <h1>Signup</h1>
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
                fullWidth
                value={values.login}
                onChange={handleChange("login")}
                className={clsx(classes.margin, classes.textField)}
              />
            </FormControl>
            <br></br>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={values.showPassword1 ? "text" : "password"}
                value={values.password1}
                onChange={handleChange("password1")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword1}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword1 ? (
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
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <InputLabel htmlFor="standard-adornment-password">
                Password confirmation
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={values.showPassword2 ? "text" : "password"}
                value={values.password2}
                onChange={handleChange("password2")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword2}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="filled"
            >
              <br></br>
              <TextField
                label="First Name"
                id="outlined-start-adornment"
                margin="normal"
                fullwidth
                value={values.firstName}
                onChange={handleChange("firstName")}
                className={clsx(classes.margin, classes.textField)}
              />
            </FormControl>

            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="filled"
            >
              <TextField
                label="Name"
                id="outlined-start-adornment"
                margin="normal"
                fullwidth
                value={values.name}
                onChange={handleChange("name")}
                className={clsx(classes.margin, classes.textField)}
              />
            </FormControl>
            <br></br>

            <br></br>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateUser}
            >
              Create new account
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
