import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { IssuePriority, IssuePriorityCopy } from 'shared/constants/issues';
import { Select, IssuePriorityIcon } from 'shared/components';

import { SectionTitle } from '../Styles';
import { Priority, Label } from './Styles';

const propTypes = {
  taskList: PropTypes.array.isRequired,
  selectTask: PropTypes.func.isRequired,
  selectedTask: PropTypes.object.isRequired
};

const TaskSelect = ({ taskList, selectTask, selectedTask }) => (
  <Fragment>
    <Select
      variant="empty"
      placeholder = "Select a Task from the list"
      withClearValue={false}
      dropdownWidth={343}
      name="taskSelect"
      value={selectedTask.id}
      options={taskList.map(task => ({
        value: task.id,
        label: task.name,
      }))}
      onChange={task => selectTask(task)}
      renderValue={({ value: taskId }) => renderPriorityItem(taskList.find(task => task.id === taskId).name, true)}
      renderOption={({ label: task }) => renderPriorityItem(task)}
    />
  </Fragment>
);

const renderPriorityItem = (task, isValue) => (
  <Priority isValue={isValue}>
    <Label>{task}</Label>
  </Priority>
);

TaskSelect.propTypes = propTypes;

export default TaskSelect;
