import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Icon, ProjectAvatar } from 'shared/components';

import {
  Sidebar,
  ProjectInfo,
  ProjectTexts,
  ProjectName,
  ProjectCategory,
  Divider,
  LinkItem,
  LinkText,
  NotImplemented,
} from './Styles';

const ProjectSidebar = () => {

  return (
    <Sidebar>
      <ProjectInfo>
        <ProjectAvatar />
        <ProjectTexts>
          <ProjectName>Demaneistic</ProjectName>
          <ProjectCategory>Design Management</ProjectCategory>
        </ProjectTexts>
      </ProjectInfo>

      {renderLinkItem('Project Board', 'board', '/projects')}
      {renderLinkItem('Task Master', 'settings', 'taskMaster')}
      <Divider />
      {renderLinkItem('Work Report', 'shipping')}
      {renderLinkItem('Issues and filters', 'issues')}
      {renderLinkItem('Pages', 'page')}
      {renderLinkItem('Reports', 'reports')}
      {renderLinkItem('Components', 'component')}
    </Sidebar>
  );
};

const renderLinkItem = (text, iconType, path) => {
  const isImplemented = !!path;

  const linkItemProps = isImplemented
    ? { as: NavLink, exact: true, to: `${path}` }
    : { as: 'div' };

  return (
    <LinkItem {...linkItemProps}>
      <Icon type={iconType} />
      <LinkText>{text}</LinkText>
      {!isImplemented && <NotImplemented>Not implemented</NotImplemented>}
    </LinkItem>
  );
};


export default ProjectSidebar;
