import React from 'react';
import PropTypes from 'prop-types';

import { sortByNewest } from 'shared/utils/javascript';

import Create from './Create';
import Comment from './Comment';
import { Comments, Title } from './Styles';

const propTypes = {
  task: PropTypes.object.isRequired,
  fetchTask: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsComments = ({ task, fetchTask }) => (
  <Comments>
    <Title>Comments: </Title>
    <Create taskId={task.id} fetchIssue={fetchTask} />

    {sortByNewest(task.comments, 'createdAt').map(comment => (
      <Comment key={comment.id} comment={comment} fetchIssue={fetchTask} />
    ))}
  </Comments>
);

ProjectBoardIssueDetailsComments.propTypes = propTypes;

export default ProjectBoardIssueDetailsComments;
