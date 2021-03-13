import React from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';
import { Droppable } from 'react-beautiful-dnd';
import { ProjectPage, Issues } from './Styles';
import useApi from 'shared/hooks/api';
import { PageLoader, PageError } from 'shared/components';
import Lists from './Lists';


const Projects = () => {
  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/projects');
  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { projects } = data;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    console.log(updatedFields);
    setLocalData(currentData => ({
      projects: {
        ...currentData.projects,
      },
    }));
  };

  return (
    <ProjectPage>
      Projects

      {/* {  projects.map((project, index) => (
        <List project={project} index={index} key={index}>

        </List>
      ))} */}
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
