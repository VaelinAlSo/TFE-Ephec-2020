import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MenuSearch from "./menuSearch";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import popcorn from "../assets/popcorn.png";

import Typography from "@material-ui/core/Typography";
import PredictForm from "./predictForm";
import { Link, Redirect } from "react-router-dom";
import NavTabs from "./navtabs";

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

export default function Infos() {
  const [redirect, setRedirect] = React.useState(false);
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();

  return (
    <div className={classes.root} padding="20px">
      <MenuSearch></MenuSearch>

      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Grid item xs={4}>
            <br></br>

            <br></br>
            <img alt="Bannière" src={popcorn} width="15%" height="15%" />
          </Grid>
          <br></br>
          <Grid item xs={6} align="center">
            <h1>About us</h1>

            <p>
              I developed this website first as a test for myself to see if I
              could do it, and secondly to grow as an IT professional because
              there were so many new things I had to learn to make this project
              work.<br></br>
              <br></br> It has combined different passions and incorporated
              interesting technologies for me to learn such as Machine Learning
              and Data analysis.{" "}
            </p>
            <br></br>
            <h2> Development </h2>
            <p>
              This website is built with ReactJs with a Backend in NodeJS. I
              used python to work on the machine learning models. There are four
              main models we are using(
              <a
                href="https://en.wikipedia.org/wiki/Linear_regression"
                target="_blank"
              >
                Linear regression
              </a>{" "}
              and{" "}
              <a
                href="https://en.wikipedia.org/wiki/Artificial_neural_network"
                target="_blank"
              >
                neural Networks
              </a>{" "}
              , 65xx and 12xx).<br></br>
              The first two are referred to as 65xx in the prediction models.
              They are based on a larger quantity of Data but ended up being far
              less precise because the data was not refined enough and therefore
              lacked in quality.<br></br>
              <br></br> The 12xx models are the ones that I am the most happy
              with. I managed to work and refactor the data (adding conditions,
              modifying the typography and sorting them differently). This model
              ended up being far more precise than the ones I had before but I
              still wanted to display the results of the previous ones to show
              the evolutions of the models.
            </p>
            <br></br>
            <h2>Future improvements</h2>

            <p>
              I plan on working a bit more on this website to include a model
              designed on the cast and crew of the movies so you'd be able to
              design the movie you had always wanted to see and get an estimate
              of how well he would do at the box office.
            </p>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
