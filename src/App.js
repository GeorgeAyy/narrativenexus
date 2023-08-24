import TextEditor from "./TextEditor";
import SumAndPar from "./sumandpar";
import React from "react";
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const ReactApp = () => {
  

  return (
    <Router>
      <Switch>
        <Route exact path="/">
         <Home />
        </Route>

        <Route exact path="/documents">
          <Redirect to={`/documents/ ${uuidv4()}`} />
        </Route>

        <Route path="/documents/:id">
          <TextEditor />
        </Route>
        
        <Route path="/sumandpar">
          <SumAndPar />
        </Route>
        
        

        
      </Switch>
    </Router>
  );
};

export default ReactApp;
