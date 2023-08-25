import TextEditor from "./TextEditor";
import SumAndPar from "./sumandpar";
import SignUp from './signup';
import React, { useState, useEffect } from "react";
import LogIn from './login';
import NotFound from './notfound';
import TestPage from './testpage';
import Navbar from "./components/Navbar";
import Section from "./components/Section";
import { useHistory } from 'react-router-dom';
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
        <Route path="/signup">
          <SignUp />
        </Route>
        
        <Route path="/login">
          <LogIn />
        </Route>

        <Route path="/testpage">
          <TestPage />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>

      </Switch>
    </Router>
  );
};

export default ReactApp;
