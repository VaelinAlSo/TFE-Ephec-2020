import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MenuSearch from "./menuSearch";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import popcorn from "../assets/popcorn.png";
import petit from "../assets/petit.png";
import PredictForm from "./predictForm";
import { Link, Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import NavTabs from "./navtabs";
import Snackbar from "@material-ui/core/Snackbar";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAlert from "@material-ui/lab/Alert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

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

export default function Accueil() {
  const [redirect, setRedirect] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <div className={classes.root}>
      {redirect && <Redirect to="Prediction" />}
      {redirect && <Redirect to="Infos" />}

      <MenuSearch></MenuSearch>
      <div className={classes.root}>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="info">
            this website uses cookies to enhance user experience
          </Alert>
        </Snackbar>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={2} color="primary"></Grid>
        <Grid item xs={8} align="center" color="primary">
          <h1>Accueil</h1>
          <br></br>
          <br></br>
          <br></br>
          <Grid item xs={4}>
            <img alt="Bannière" src={popcorn} width="50%" height="50%" />
          </Grid>
          <br></br>
          <Link to="PredictForm" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
            >
              Start predicting a movie
            </Button>
          </Link>
          <br></br>
          <br></br>
          <Link to="Infos" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              className={classes.button}
            >
              About us
            </Button>
          </Link>
        </Grid>

        <Grid item xs color="primary" align="right">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                How do the predictions work ?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We created prediction models with machine learning using python
                as our programming language and the tool Orange3.<br></br> if
                you want to know more about it click right there.
                <br></br>
                {<ArrowDownwardIcon />}
                <br></br>
                <Link to="Infos" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    className={classes.button}
                  >
                    I want to know more
                  </Button>
                </Link>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </div>
  );
}
