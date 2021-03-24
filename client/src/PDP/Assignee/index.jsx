import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Avatar, Select, Icon } from 'shared/components';

import { SectionTitle } from '../Styles';
import { User, Username } from './Styles';

const propTypes = {
  task: PropTypes.object.isRequired,
  updateTaskUser: PropTypes.func.isRequired,
  projectUsers: PropTypes.array.isRequired,
  width: PropTypes.number,
};

const ProjectBoardIssueDetailsAssignee = ({ task, updateTaskUser, projectUsers, width }) => {
  const getUserById = userId => projectUsers.find(user => user.id === userId);

  const userOptions = projectUsers.map(user => ({ value: user.id, label: user.name }));

  return (
    <Fragment>
      <SectionTitle>Assignee: </SectionTitle>
      <Select
        variant="empty"
        dropdownWidth={width || 343}
        withClearValue={false}
        name="assignee"
        value={task.userId || task.assigneeId}
        options={userOptions}
        onChange={userId => updateTaskUser(userId)}
        renderValue={({ value: userId }) => renderUser(getUserById(userId), true)}
        renderOption={({ value: userId }) => renderUser(getUserById(userId))}
      />
    </Fragment>
  );
};

const renderUser = (user, isSelectValue, removeOptionValue) => (
  <User
    key={user.id}
    isSelectValue={isSelectValue}
    withBottomMargin={!!removeOptionValue}
    onClick={() => removeOptionValue && removeOptionValue()}
  >
    <Avatar name={user.name} size={24} />
    <Username>{user.name} ({user.tasks.length}) </Username>
    {removeOptionValue && <Icon type="close" top={1} />}
  </User>
);

ProjectBoardIssueDetailsAssignee.propTypes = propTypes;

export default ProjectBoardIssueDetailsAssignee;
