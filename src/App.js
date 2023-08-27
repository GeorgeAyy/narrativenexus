import TextEditor from "./pages/TextEditor";
import SumAndPar from "./pages/sumandpar";
import SignUp from "./pages/signup";
import React, { useState, useEffect } from "react";
import LogIn from "./pages/login";
import NotFound from "./pages/notfound";
import Home from "./pages/Home";
import PromptGenerator from "./pages/promptGenerator";
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
          <Redirect to={`/documents/${uuidv4()}`} />
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

        <Route path="/generatepromts">
          <PromptGenerator />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default ReactApp;
