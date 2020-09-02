import React from "react";
import { Switch, Route } from "react-router-dom";
import MenuSearch from "./menuSearch";
import Accueil from "./accueil";
import PredictForm from "./predictForm";
import Login from "./login";
import Signup from "./signup";
import Prediction from "./prediction";
import Infos from "./infos";

//import NavTabs from "./navtab";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Accueil />
      </Route>

      <Route path="/predictForm">
        <PredictForm />
      </Route>

      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>

      <Route path="/prediction" render={(props) => <Prediction {...props}/>}>
        
      </Route>
      <Route path="/infos">
        <Infos />
      </Route>
    </Switch>
  );
};

export default Routes;
