import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { IssuePriority, IssuePriorityCopy } from 'shared/constants/issues';
import { Select, IssuePriorityIcon } from 'shared/components';

import { SectionTitle } from '../Styles';
import { Priority, Label } from './Styles';

const propTypes = {
  task: PropTypes.object.isRequired,
  updateTaskPriority: PropTypes.func.isRequired,
  index: PropTypes.number,
  width: PropTypes.number
};

const ProjectBoardIssueDetailsPriority = ({ task, updateTaskPriority, index, width }) => (
  <Fragment>
    <Select
      variant="empty"
      withClearValue={false}
      dropdownWidth={width || 343}
      name="priority"
      value={task.priority}
      options={Object.values(IssuePriority).map(priority => ({
        value: priority,
        label: IssuePriorityCopy[priority],
      }))}
      onChange={priority => updateTaskPriority(priority, null, index, 'priority')}
      renderValue={({ value: priority }) => renderPriorityItem(priority, true, !width)}
      renderOption={({ value: priority }) => renderPriorityItem(priority, null, true)}
    />
  </Fragment>
);

const renderPriorityItem = (priority, isValue, showLabel) => (
  <Priority isValue={isValue}>
    <IssuePriorityIcon priority={priority} top={1}/>
    {showLabel ? <Label>{IssuePriorityCopy[priority]}</Label> : <></>}
  </Priority>
);

ProjectBoardIssueDetailsPriority.propTypes = propTypes;

export default ProjectBoardIssueDetailsPriority;
