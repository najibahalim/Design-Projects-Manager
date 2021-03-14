import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import Projects from 'Projects';
import PDP from 'PDP';
import TaskMaster from 'TaskMaster';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to="/project" />
      <Route path="/authenticate" component={Authenticate} />
      <Route path="/project" component={Project} />
      <Route path="/projects" component={Projects} />
      <Route path="/p/:projectId" component={PDP} />
      <Route path="/taskMaster" component={TaskMaster} />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
