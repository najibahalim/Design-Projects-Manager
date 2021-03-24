import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { IssueStatus, IssueStatusCopy } from 'shared/constants/issues';
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
    <SectionTitle>Status: </SectionTitle>
    <Select
      variant="empty"
      dropdownWidth={width || 343}
      withClearValue={false}
      name="status"
      value={task.status}
      options={Object.values(IssueStatus).map(status => ({
        value: status,
        label: IssueStatusCopy[status],
      }))}
      onChange={status => updateTaskStatus(status)}
      renderValue={({ value: status }) => (
        <Status isValue color={status}>
          <div>{IssueStatusCopy[status]}</div>
          <Icon type="chevron-down" size={18} />
        </Status>
      )}
      renderOption={({ value: status }) => (
        <Status color={status}>{IssueStatusCopy[status]}</Status>
      )}
    />
  </Fragment>
);

ProjectBoardIssueDetailsStatus.propTypes = propTypes;

export default ProjectBoardIssueDetailsStatus;
