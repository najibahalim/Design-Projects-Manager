import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { removeStoredAuthToken } from 'shared/utils/authToken';
import history from 'browserHistory';


import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Button, Icon, ProjectAvatar } from 'shared/components';

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
import { AssigneeAvatar } from 'Projects/Lists/List/Issue/Styles';

const ProjectSidebar = () => {

  return (
    <Sidebar>
      <ProjectInfo>
        <ProjectAvatar />
        <ProjectTexts>
          <ProjectName>DiMan</ProjectName>
          <ProjectCategory>Design Management</ProjectCategory>
         
        </ProjectTexts>
      </ProjectInfo>
      {renderLinkItem('Project Board', 'board', '/projects')}
      {renderLinkItem('Task Master', 'settings', '/taskMaster')}
      <Divider />
      {renderLinkItem('Performance Report', 'reports', '/reports/user')}
      {renderLinkItem('Task Report', 'component', '/reports/task')}
      {renderLinkItem('Pages', 'page')}
      {renderLinkItem('Reports', 'reports')}
      {renderLinkItem('Components', 'component')}
      <Divider />
      
      <ProjectInfo>
        <AssigneeAvatar name={localStorage.getItem("name")} size={24}></AssigneeAvatar>
        <ProjectTexts>
          <ProjectName>  Welcome {localStorage.getItem("name")}</ProjectName>
          <ProjectCategory> <Button onClick={() => { removeStoredAuthToken(); history.push('/authenticate');} }> <Icon type="arrow-left-circle"></Icon> Logout</Button> </ProjectCategory>
        </ProjectTexts>
        
      </ProjectInfo>



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
