import React from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';
import { Droppable } from 'react-beautiful-dnd';
import { ProjectPage, Issues } from './Styles';
import { updateProjectsByid } from 'shared/utils/javascript';
import useApi from 'shared/hooks/api';
import { PageLoader, PageError } from 'shared/components';
import Lists from './Lists';
import Sidebar from './Sidebar';



const Projects = () => {
  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/projects');
  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { projects } = data;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      projects: updateProjectsByid(currentData.projects, issueId, updatedFields),
    }));
  };

  return (
    <ProjectPage>
      <Sidebar />

      Projects
      <Lists
        projects={projects}
        filters={{
          searchTerm: '',
          userIds: [],
          myOnly: false,
          recent: false,
        }}
        updateLocalProjectIssues={updateLocalProjectIssues}
      />

    </ProjectPage>
  );
};

export default Projects;
