import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MenuSearch from "./menuSearch";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Icon from "@material-ui/core/Icon";
import popcorn from "../assets/popcorn.png";
import PredictForm from "./predictForm";
import { Link, Redirect } from "react-router-dom";
import NavTabs from "./navtabs";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Chart from "react-google-charts";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 200,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

// budgetColor = "#009933" // #9dde04
// realBoxOfficeColor =  "#00a52714"

export default function Prediction(props) {
  const [redirect, setRedirect] = React.useState(false);
  const [scatterData, setScatterData] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [chartYMin, setChartYMin] = React.useState(0);
  const [chartYMax, setChartYMax] = React.useState(1000000000);
  const [searchFields, setSearchFields] = React.useState({});
  
  const classes = useStyles();

  React.useEffect(() => {
   // console.log("predictionsArray", props.location.state.predictions);

    var predictions0 = props.location.state.predictions.predictions;

    //console.log("predictions0 Array.isArray", Array.isArray(predictions0))

    var mFields = props.location.state.movieFields;
    let budget = parseFloat(mFields.Budget)
    setSearchFields(mFields);

    // console.log("movieFields : " + mFields);
    var scatterData0 = [["Prediction", "Budget", "Boxoffice", {'type': 'string', 'role': 'style'}]]; // , "Real Box office Result"  , "Average"

    var tableData0 = [
      [
        { type: "string", label: "ML type" },
        { type: "number", label: "Box office prediction" },
      ],
    ];

    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    let min = 10000000000;
    let max = 0;

    let tableDataBudgetLine = 
    ['<font color="#009933">Budget</font>', //budgetColor
    {
      'v': budget,
      'f': formatter.format(budget)
    }]
    tableData0.push(tableDataBudgetLine)

    predictions0.forEach((p) => {
      var lineScatter = p.slice();
      lineScatter.splice( 1, 0, budget );

      let realBoxOffice = p[0].startsWith('Real BoxOffice')
      if (realBoxOffice) {
        lineScatter.push('point { size: 15; shape-type: star; fill-color: #a52714; }')
      } else  {
        lineScatter.push(null)
      }

      scatterData0.push(lineScatter);

      min = Math.min(min, p[1]);
      max = Math.max(max, p[1]);

      var lineTable = [(realBoxOffice?(' <font color="#a52714">  <b>'+p[0]+'</b></font'):p[0])];
      lineTable.push({
        v: p[1],
        f: formatter.format(p[1]),
      });
      tableData0.push(lineTable);
    });

  //  console.log('scatterData0', scatterData0)

    setScatterData(scatterData0);
    setTableData(tableData0);
    setChartYMin(min * 0.75);
    setChartYMax(max * 1.25);
  }, []);
  /*
  {[
    ["Prediction", "Boxoffice", "Real Box office Result", "Average"],
    ["Neural network 12xx", 537188601, 829888984, 769167530],
    ["Linear regression 12xx", 627809427, 829888984, 769167530],
    ["linear regression 65xx", 199923420, 829888984, 769167530],
    ["neural network 65xx", 118468787, 829888984, 769167530],
    ["Crew linear regression", 1711748673, 829888984, 769167530],
  ]}
*/

  /*
              ["Neural Neutwork 12xx", { v: 537188601, f: "$537,188,601" }],
              ["Linear Regression 12xx", { v: 627809427, f: "$627,809,427" }],
              ["Linear Regression 65xx", { v: 199923420, f: "$199,923,420" }],
              ["Neural Network 65xx", { v: 118468787, f: "$118,468,787" }],
              [
                "Linear Regression Crew",
                { v: 1711748673, f: "$1,711,748,673" },
              ],
              ["Average", { v: 769167530, f: "$769,167,530" }]
*/

  return (
    <div className={classes.root}>
      {redirect && <Redirect to="PredictForm" />}

      <MenuSearch></MenuSearch>
      <div id="fb-root"></div>
      <script
        async
        defer
        crossorigin="anonymous"
        src="https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v8.0"
        nonce="2VL5tUZT"
      ></script>
      <Grid container spacing={4}>
        {/* <Grid item xs={12} align="center"> */}
        <Grid item xs align="center"></Grid>
        <Grid item xs={8} align="center">
          <br></br>
          <h2>ML Prediction for this movie</h2>
          <img alt="Bannière" src={popcorn} width="10%" height="55%" />
        </Grid>
        <Grid item xs align="center">
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Feature</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Your Pick</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Studio
                  </TableCell>
                  <TableCell align="right">{searchFields.Studio}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Classification
                  </TableCell>
                  <TableCell align="right">{searchFields.Code}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Budget <br></br>(see <font color="#009933">line</font>)
                  </TableCell>
                  <TableCell align="right">{searchFields.Budget}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Duration
                  </TableCell>
                  <TableCell align="right">
                    {searchFields.Duration2} min
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Year
                  </TableCell>
                  <TableCell align="right">{searchFields.Year}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Genres
                  </TableCell>
                  <TableCell align="right">{searchFields.Genres}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} direction="column" align="center">
        
          <Chart
            width={"70%"}
            height={"400px"}
            chartType="ComboChart"
            loader={<div>Loading Machine Learning Models</div>}
            data={scatterData}
            options={{
              title: "Predictions from our different models",
              hAxis: { title: "Prediction" },
              vAxis: {
                title: "Box office result",  // : Log Scale !!
                minValue: { chartYMin },
                maxValue: { chartYMax },
                scaleType: 'linear' // 'log'
              },
              legend: "none",
              colors: ["#009933", "#0645ba"], // budgetColor , "#9dde04" , "#c41004"
              seriesType: "scatter",
              series: { 0: { type: "line" } }, // , 2: { type: "line" }
            }}
            rootProps={{ "data-testid": "1" }}
          />
        </Grid>

        <br></br>
        <Grid item xs={12} align="center">
          <Chart
            width={"100%"}
            height={"200px"}
            chartType="Table"
            loader={<div>Loading Machine Learning Model</div>}
            data={tableData}
            options={{
              allowHtml: true,
              showRowNumber: true,
              colors: ["#0645ba"],
            }}
            rootProps={{ "data-testid": "1" }}
          />

          <Link to="PredictForm" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
            >
              Predict another movie
            </Button>
          </Link>
          <br></br>
          <div
            class="fb-share-button"
            data-href="https://mlmoviepredict.com"
            data-layout="button_count"
            data-size="large"
          >
            <br></br>
            <Button size="small" variant="outlined" color="primary">
              <a
                target="_blank"
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmlmoviepredict.com%2F&amp;src=sdkpreparse"
                class="fb-xfbml-parse-ignore"
              >
                Partager
              </a>
            </Button>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </Grid>
        {/*</Grid> */}
      </Grid>
    </div>
  );
}
