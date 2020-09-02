import "./styles.css";

import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as Papa from "papaparse";
import * as Plotly from "plotly.js-dist";
import _ from "lodash";

Papa.parsePromise = function(file) {
  return new Promise(function(complete, error) {
    Papa.parse(file, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete,
      error
    });
  });
};

const  dumpTensor = (tensor) => {
  const tensorData = tensor.dataSync();
  for (let index = 0; index < tensorData.length; index++) { 
    console.log(tensorData[index]); 
  } 
}



const prepareData = async () => {

  const uploadCSVDataInput = document.getElementById('csv-file');

  console.log('file', uploadCSVDataInput.files[0] ) ; //, tf.io.browserFiles(uploadCSVDataInput.files[0]));

  const csv = await Papa.parsePromise(

    //tf.io.browserFiles([uploadCSVDataInput])
      //     "file://D:/IT/school/Gilles_TFE/ws-vsc/movies-tfe/src/data/customer-churn.csv"
       //   "https://raw.githubusercontent.com/curiousily/Customer-Churn-Detection-with-TensorFlow-js/master/src/data/customer-churn.csv"
       uploadCSVDataInput.files[0]
  );

  const data = csv.data;
  console.log('file loaded with length', data.length)
  return data.slice(0, data.length - 1);
};

const renderHistogram = (container, data, column, config) => {
  const defaulted = data.filter(r => r["Churn"] === "Yes").map(r => r[column]);
  const paid = data.filter(r => r["Churn"] === "No").map(r => r[column]);

  const dTrace = {
    name: "Churned",
    x: defaulted,
    type: "histogram",
    opacity: 0.35,
    marker: {
      color: "mediumvioletred"
    }
  };

  const hTrace = {
    name: "Retained",
    x: paid,
    type: "histogram",
    opacity: 0.35,
    marker: {
      color: "dodgerblue"
    }
  };

  Plotly.newPlot(container, [dTrace, hTrace], {
    barmode: "overlay",
    xaxis: {
      title: config.xLabel
    },
    yaxis: { title: "Count" },
    title: config.title
  });
};

const renderChurn = data => {
  const churns = data.map(r => r["Churn"]);

  const [churned, retained] = _.partition(churns, o => o === "Yes");

  const chartData = [
    {
      labels: ["Churned", "Retained"],
      values: [churned.length, retained.length],
      type: "pie",
      opacity: 0.6,
      marker: {
        colors: ["mediumvioletred", "dodgerblue"]
      }
    }
  ];

  Plotly.newPlot("churn-cont", chartData, {
    title: "Churned vs Retained payment"
  });
};

const renderSexChurn = data => {
  const churned = data.filter(r => r["Churn"] === "Yes");
  const retained = data.filter(r => r["Churn"] === "No");

  const [dMale, dFemale] = _.partition(churned, s => s.gender === "Male");
  const [pMale, pFemale] = _.partition(retained, b => b.gender === "Male");

  var sTrace = {
    x: ["Male", "Female"],
    y: [dMale.length, dFemale.length],
    name: "Churned",
    type: "bar",
    opacity: 0.6,
    marker: {
      color: "mediumvioletred"
    }
  };

  var bTrace = {
    x: ["Male", "Female"],
    y: [pMale.length, pFemale.length],
    name: "Retained",
    type: "bar",
    opacity: 0.6,
    marker: {
      color: "dodgerblue"
    }
  };

  Plotly.newPlot("sex-churn-cont", [sTrace, bTrace], {
    barmode: "group",
    title: "Sex vs Churn Status"
  });
};

const renderSeniorChurn = data => {
  const churned = data.filter(r => r["Churn"] === "Yes");
  const retained = data.filter(r => r["Churn"] === "No");

  const [dMale, dFemale] = _.partition(churned, s => s.SeniorCitizen === 1);
  const [pMale, pFemale] = _.partition(retained, b => b.SeniorCitizen === 1);

  var sTrace = {
    x: ["Senior", "Non senior"],
    y: [dMale.length, dFemale.length],
    name: "Churned",
    type: "bar",
    opacity: 0.6,
    marker: {
      color: "mediumvioletred"
    }
  };

  var bTrace = {
    x: ["Senior", "Non senior"],
    y: [pMale.length, pFemale.length],
    name: "Retained",
    type: "bar",
    opacity: 0.6,
    marker: {
      color: "dodgerblue"
    }
  };

  Plotly.newPlot("senior-churn-cont", [sTrace, bTrace], {
    barmode: "group",
    title: "Senior vs Churn Status"
  });
};

// normalized = (value − min_value) / (max_value − min_value)
const normalize = tensor =>
  tf.div(
    tf.sub(tensor, tf.min(tensor)),
    tf.sub(tf.max(tensor), tf.min(tensor))
  );

const oneHot = (val, categoryCount) =>
  Array.from(tf.oneHot(val, categoryCount).dataSync());

const toCategorical = (data, column) => {
  const values = data.map(r => r[column]);
  const uniqueValues = new Set(values);

  const mapping = {};

  Array.from(uniqueValues).forEach((i, v) => {
    mapping[i] = v;
  });

  const encoded = values
    .map(v => {
      if (!v) {
        return 0;
      }
      return mapping[v];
    })
    .map(v => oneHot(v, uniqueValues.size));

  return encoded;
};

const toTensors = (data, categoricalFeatures, testSize) => {
  const categoricalData = {};
  categoricalFeatures.forEach(f => {
    categoricalData[f] = toCategorical(data, f);
  });

  // already numeric features

  /*  from  Churn
    "SeniorCitizen",
    "tenure",
    "MonthlyCharges",
    "TotalCharges"
  */


  //// Id,Random,CatML,Title,Year,Code,Duration,Duration2,DurationPatched,Genres,Studio,Budget,BudgetLog,Result,ResultLog,Date,Action,Adult,Adventure,Animation,Biography,Comedy,Crime,Documentary,Drama,Family,Fantasy,History,Horror,Music,Musical,Mystery,News,Reality-TV,Romance,Sci-Fi,Sport,Talk-Show,Thriller,War,Western,null,Crew,Actors


  const features = [
    "Year", "Duration2", "DurationPatched", 
    //  remove for file  65xx  
     "Budget", "BudgetLog",
    "Action","Adult","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama","Family","Fantasy","History","Horror","Music","Musical","Mystery","News","Reality-TV","Romance","Sci-Fi","Sport","Talk-Show","Thriller","War","Western","null"
  ].concat(Array.from(categoricalFeatures));

  /*
  dataTR = data.filter((v,i) => v.CatML == 'TR')
  dataVAL = data.filter((v,i) => v.CatML == 'VAL')
  */

  
  tf.util.shuffle(data)
  console.log("shuffled")


  const X = data.map((r, i) =>
    features.flatMap(f => {
      if (categoricalFeatures.has(f)) {
        return categoricalData[f][i];
      }

      return r[f];
    })
  );

  
  const X_t = normalize(tf.tensor2d(X));
  console.log("normalized")
  

  /*
  const X_t = tf.tensor2d(X);
  console.log("not normalized")
  */

  // const y = tf.tensor(toCategorical(data, "Churn"));

  var y = tf.tensor(data.map(r => r["ResultLog"]));
 // var y = tf.tensor(data.map(r => r["Result"]));
  
  y = normalize(y)
  console.log("y   normalized")

  var xTrain_arr= new Array()
  var yTrain_arr= new Array()
  var xTest_arr= new Array()
  var yTest_arr= new Array()
  var xVal_arr= new Array()
  var yVal_arr= new Array()

  var idxTrain
  var idxTest

  var x_arr = X_t.arraySync()
  var y_arr = y.arraySync()

  const xLen = x_arr.length;
 
  /*
  console.log('length x_arr',xLen)

  console.log('data[0]',data[0])
  console.log('data[0].CatML',data[0].CatML)
  console.log('x_arr[0]',x_arr[0])
  console.log('y_arr[0]',y_arr[0])

  console.log('data[1]',data[1])
  console.log('data[1].CatML',data[1].CatML)
  console.log('x_arr[1]',x_arr[1])
  console.log('y_arr[1]',y_arr[1])
  */


  for ( var i = 0; i < xLen; i++) {
   var catML = data[i].CatML;
    if (catML == 'TR') {
      xTrain_arr.push(x_arr[i])
      yTrain_arr.push(y_arr[i])
    } else if (catML == 'TST') {
      xTest_arr.push(x_arr[i])
      yTest_arr.push(y_arr[i])
    } if (catML == 'VAL') {
      xVal_arr.push(x_arr[i])
      yVal_arr.push(y_arr[i])
    }
  }

  console.log('lengths train', xTrain_arr.length, yTrain_arr.length)
  console.log('lengths test', xTest_arr.length, yTest_arr.length)
  console.log('lengths val', xVal_arr.length, yVal_arr.length)

  const xTrain = tf.tensor(xTrain_arr)
  const yTrain = tf.tensor(yTrain_arr)
  const xTest = tf.tensor(xTest_arr)
  const yTest = tf.tensor(yTest_arr)
  const xVal = tf.tensor(xVal_arr)
  const yVal = tf.tensor(yVal_arr)


  /*const splitIdx = parseInt((1 - testSize) * data.length, 10);

  const [xTrain, xTest] = tf.split(X_t, [splitIdx, data.length - splitIdx]);
  const [yTrain, yTest] = tf.split(y, [splitIdx, data.length - splitIdx]);
  */


  return [xTrain, yTrain, xTest, yTest, xVal, yVal];
};

const trainModel = async (xTrain, yTrain, xVal, yVal) => {
  const model = tf.sequential();

  // from Churn

  /*
  model.add(
    tf.layers.dense({
      units: 32,
      activation: "relu",
      inputShape: [xTrain.shape[1]]
    })
  );

  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu"
    })
  );

  model.add(tf.layers.dense({ units: 2, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"]
  });

  */

  // from   layers-imdb  [node]
  /*
    model.add(tf.layers.dense({ inputShape: [28], activation: 'relu', units: 250 }));
    model.add(tf.layers.dense({ activation: 'relu', units: 1 }));
    
    model.compile({ optimizer: 'sgd', loss: 'meanAbsoluteError' });
    */

   const kernelRegularizer = tf.regularizers.l2();

   model.add(tf.layers.dense({ inputShape:[xTrain.shape[1]], activation: 'relu', units: 1500  }));
   model.add(tf.layers.dense({  activation: 'relu', units: 2000 , kernelRegularizer }));
  // model.add(tf.layers.dropout({rate: 0.25}));
   model.add(tf.layers.dense({  activation: 'relu', units: 400 , kernelRegularizer }));
   model.add(tf.layers.dense({ activation: 'relu', units: 1 }));
    
   console.log("model constructed")

   var LEARNING_RATE = 0.5 ; //3; // 0.001; // 0.1; // 1; //0.01;
   model.compile({
   optimizer: tf.train.adam(0.2), //  sgd(LEARNING_RATE),
   loss: 'meanAbsoluteError'});
   
   //model.compile({ optimizer: 'sgd', loss: 'meanAbsoluteError' });
    
    
    console.log("model compiled")


  const lossContainer = document.getElementById("loss-cont");

  await model.fit(xTrain, yTrain, {
   // batchSize: 77,
    epochs: 33, // 12, //33, // 77, // 300, //144 ,// 33, // 77, //10  //100
    shuffle: true,
    // validationSplit: 0.1,
    validationData: [xVal, yVal], 
    callbacks: 
        [
        tfvis.show.fitCallbacks(
          lossContainer,
          ["loss", "val_loss"],  //  , "acc", "val_acc"   ... no acc for  predict num value !
          {
            callbacks: ["onEpochEnd"]
          }
        ) , 
        {onEpochEnd: async (epoch, logs) => {
           // console.log('epoch, logs',epoch, logs);

           
          var lr = LEARNING_RATE / Math.pow(2,( Math.floor(2 * (epoch+1)/10)));
           // console.log('new lr', lr)

          if (lr < 0.005) { 
            lr = 0.005 ;
           // console.log('lr stopped at 0.005');  // does not happen before epoch 33
          }
      
         // model.optimizer.setLearningRate( lr );
          }}
        ]
  });

  return model;
};

const run = async () => {
  const uploadCSVDataInput = document.getElementById('csv-file');
  
  if (uploadCSVDataInput==null || uploadCSVDataInput.files.length==0 ) {
    console.log("skipped run because  uploaded-file is null");
    return ;
  } else {
    console.log('starting reading data');
  }
  const data = await prepareData();

// histograms from Churn

/*
  renderChurn(data);
  renderSexChurn(data);
  renderSeniorChurn(data);

  renderHistogram("tenure-cont", data, "tenure", {
    title: "Tenure duration",
    xLabel: "Tenure (months)"
  });

  renderHistogram("monthly-charges-cont", data, "MonthlyCharges", {
    title: "Amount charged monthly",
    xLabel: "Amount (USD)"
  });

  renderHistogram("total-charges-cont", data, "TotalCharges", {
    title: "Total amount charged",
    xLabel: "Amount (USD)"
  });
  */

  // from  Churn
  /*
    "TechSupport",
    "Contract",
    "PaymentMethod",
    "gender",
    "Partner",
    "InternetService",
    "Dependents",
    "PhoneService",
    "TechSupport",
    "StreamingTV",
    "PaperlessBilling"
  */

  const categoricalFeatures = new Set([
    "Code", "Studio"
  ]);

  const [xTrain,  yTrain, xTest, yTest, xVal, yVal] = toTensors(
    data,
    categoricalFeatures,
    0.1
  );

  const model = await trainModel(xTrain, yTrain, xVal, yVal);

  const result = model.evaluate(xTest, yTest, {
    batchSize: 32
  });

  console.log('eval on test : loss is '); result.print();

  const resultPred = model.predict(xTest);

  console.log('print pred then yTest\n')
  resultPred.print(true)
  dumpTensor(resultPred)
  yTest.print(true)
  dumpTensor(yTest)

  console.log('print pred ', resultPred.toString())
  console.log('print yTest', yTest.toString())
  
  console.log('print with actual values ??  10^ ... later')

//  result[0].print();
//  result[1].print();


  // from  Churn  ... no confusionMatrix for predicting numeric value ... but other graph welcome
  /*
  const preds = model.predict(xTest).argMax(-1);
  const labels = yTest.argMax(-1);
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = document.getElementById("confusion-matrix");
  tfvis.render.confusionMatrix(container, {
    values: confusionMatrix,
    tickLabels: ["Retained", "Churned"]
  });

  */

};


var inputElement = document.getElementById("csv-file");
console.log('inputElement', inputElement)
inputElement.addEventListener("change", run, false);

if (document.readyState !== "loading") {
  run();
} else {
  document.addEventListener("DOMContentLoaded", run);
}
