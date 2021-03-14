import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import api from 'shared/utils/api';
import useApi from 'shared/hooks/api';
import { PageError, CopyLinkButton, Button, AboutTooltip } from 'shared/components';

import Loader from './Loader';
import Type from './Type';
import Delete from './Delete';
import Title from './Title';
import Description from './Description';
import Comments from './Comments';
import Status from './Status';
import AssigneesReporter from './AssigneesReporter';
import Priority from './Priority';
import EstimateTracking from './EstimateTracking';
import Dates from './Dates';
import { TopActions, TopActionsRight, Content, Left, Right } from './Styles';


const ProjectDetailsPage = (props) => {
  const { match: { params } } = props;

  const [{ data, error, setLocalData }, fetchProject] = useApi.get(`/projects/${params.projectId}`);


  if (!data) return <Loader />;
  if (error) return <PageError />;

  const project = data;

  const updateLocalIssueDetails = fields =>
    setLocalData(currentData => ({ project: { ...currentData.projects, ...fields } }));

  const updateIssue = updatedFields => {
    api.optimisticUpdate(`/projects/${params.projectId}`, {
      updatedFields,
      currentFields: project,
      setLocalData: fields => {
        updateLocalIssueDetails(fields);
        updateLocalProjectIssues(project.id, fields);
      },
    });
  };

  return (
    <div>
      {JSON.stringify(project)}



    </div>
    // <Fragment>
    //   <TopActions>
    //     <Type issue={project} updateIssue={updateIssue} />
    //     <TopActionsRight>
    //       <AboutTooltip
    //         renderLink={linkProps => (
    //           <Button icon="feedback" variant="empty" {...linkProps}>
    //             Give feedback
    //           </Button>
    //         )}
    //       />
    //       <CopyLinkButton variant="empty" />
    //       <Delete issue={project} fetchProject={fetchProject} modalClose={modalClose} />
    //       <Button icon="close" iconSize={24} variant="empty" onClick={modalClose} />
    //     </TopActionsRight>
    //   </TopActions>
    //   <Content>
    //     <Left>
    //       <Title issue={project} updateIssue={updateIssue} />
    //       <Description issue={project} updateIssue={updateIssue} />
    //       <Comments issue={project} fetchIssue={fetchIssue} />
    //     </Left>
    //     <Right>
    //       <Status issue={project} updateIssue={updateIssue} />
    //       <AssigneesReporter issue={project} updateIssue={updateIssue} projectUsers={projectUsers} />
    //       <Priority issue={project} updateIssue={updateIssue} />
    //       <EstimateTracking issue={project} updateIssue={updateIssue} />
    //       <Dates issue={project} />
    //     </Right>
    //   </Content>
    // </Fragment>
  );
};

export default ProjectDetailsPage;
