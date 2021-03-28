import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { TaskStatus, TaskStatusCopy } from 'shared/constants/issues';
import { Select, Icon } from 'shared/components';

import { SectionTitle } from '../Styles';
import { Status } from './Styles';

const propTypes = {
  task: PropTypes.object.isRequired,
  updateTaskStatus: PropTypes.func.isRequired,
  width: PropTypes.number,
};

const ProjectBoardIssueDetailsStatus = ({ task, updateTaskStatus, width }) => (
  <Fragment>
    {!width ? <SectionTitle>Status: </SectionTitle> : <></>}
    <Select
      variant="empty"
      dropdownWidth={width || 343}
      withClearValue={false}
      name="status"
      value={task.status}
      options={Object.values(TaskStatus).map(status => ({
        value: status,
        label: TaskStatusCopy[status],
      }))}
      onChange={status => updateTaskStatus(status)}
      renderValue={({ value: status }) => (
        <Status isValue color={status}>
          <div>{TaskStatusCopy[status]}</div>
          <Icon type="chevron-down" size={18} />
        </Status>
      )}
      renderOption={({ value: status }) => (
        <Status color={status}>{TaskStatusCopy[status]}</Status>
      )}
    />
  </Fragment>
);

ProjectBoardIssueDetailsStatus.propTypes = propTypes;

export default ProjectBoardIssueDetailsStatus;
