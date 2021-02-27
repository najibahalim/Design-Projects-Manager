import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

import { IssuePriorityIcon } from 'shared/components';

import {
  IssueLink,
  Issue,
  Title,
  Bottom,
  Assignees,
  AssigneeAvatar,
  Desc,
  Deadline,
} from './Styles';

const propTypes = {
  projectUsers: PropTypes.array.isRequired,
  issue: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const ProjectBoardListIssue = ({ projectUsers, issue, index }) => {
  const match = useRouteMatch();

  const assignees = issue.userIds.map(userId => projectUsers.find(user => user.id === userId));

  return (
    <Draggable draggableId={issue.id.toString()} index={index}>
      {(provided, snapshot) => (
        <IssueLink
          to={`${match.url}/issues/${issue.id}`}
          ref={provided.innerRef}
          data-testid="list-issue"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Issue isBeingDragged={snapshot.isDragging && !snapshot.isDropAnimating}>
            <Title>834726</Title>
            <Desc>Project Desc</Desc>
            <Bottom>
              <div>
                <IssuePriorityIcon priority={issue.priority} top={-1} left={1} />
                <Deadline>28/02/21</Deadline>
                {/* new Date().toLocaleDateString("en-GB") */}
              </div>
              <Assignees>
                {assignees.map(user => (
                  <AssigneeAvatar key={user.id} size={24} name={user.name} />
                ))}
              </Assignees>
            </Bottom>
          </Issue>
        </IssueLink>
      )}
    </Draggable>
  );
};

ProjectBoardListIssue.propTypes = propTypes;

export default ProjectBoardListIssue;
