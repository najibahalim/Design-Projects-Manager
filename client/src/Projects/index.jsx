import React from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';

import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { PageLoader, PageError } from 'shared/components';
import { ProjectPage } from './Styles';
import Board from './Board';
import Sidebar from './Sidebar';

const Projects = () => {
  const match = useRouteMatch();

  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/project');

  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { project } = data;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  return (
    <ProjectPage>
      <Sidebar project={project} />
      <Route
        path={`${match.path}/board`}
        render={() => (
          <Board
            project={project}
            fetchProject={fetchProject}
            updateLocalProjectIssues={updateLocalProjectIssues}
          />
        )}
      />

      {match.isExact && <Redirect to={`${match.url}/board`} />}
    </ProjectPage>
  );
};

export default Projects;
