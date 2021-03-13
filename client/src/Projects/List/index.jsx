import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { useRouteMatch } from 'react-router-dom';
import { IssueTypeIcon, IssuePriorityIcon } from 'shared/components';

import { IssueLink, Issue, Title, Bottom, Assignees, AssigneeAvatar } from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const ProjectBoardListIssue = ({ project, index }) => {
  const match = useRouteMatch();
  return (
    // <Draggable draggableId={project.projectNumber.toString()} index={index}>
    //   {(provided, snapshot) => (
        <IssueLink
          to={`${match.url}/${project.projectNumber}`}
          // ref={provided.innerRef}
          // data-testid="list-project"
          // {...provided.draggableProps}
          // {...provided.dragHandleProps}
        >
          <Issue isBeingDragged={false}>
            <Title>{project.name}</Title>
            <Bottom>
              <div>
            <IssueTypeIcon type={"story"} />
                <IssuePriorityIcon priority={project.priority} top={-1} left={4} />
              </div>
            </Bottom>
          </Issue>
        </IssueLink>
    //   )}
    // </Draggable>
  );
};

ProjectBoardListIssue.propTypes = propTypes;

export default ProjectBoardListIssue;
