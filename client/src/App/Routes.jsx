import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import Projects from 'Projects';
import PDP from 'PDP';
import TaskMaster from 'TaskMaster';
import TaskReport from 'TaskReport';
import UserReport from 'UserReport';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';
import Login from 'Login';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to="/project" />
      <Route path="/authenticate" component={Login} />
      <Route path="/project" component={Project} />
      <Route path="/projects" component={Projects} />
      <Route path="/p/:projectId" component={PDP} />
      <Route path="/taskMaster" component={TaskMaster} />
      <Route path="/reports/task" component={TaskReport} />
      <Route path="/reports/user" component={UserReport} />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
