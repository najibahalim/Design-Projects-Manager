import React, { useState } from 'react';
import toast from 'shared/utils/toast';
import api from 'shared/utils/api';
import { useHistory } from 'react-router-dom';
import { getStoredAuthToken, storeAuthToken } from 'shared/utils/authToken';
import Projects from '../Projects';


import {
  ProjectName,
  ProjectTexts,
  ProjectInfo,
  ProjectCategory, } from '../Projects/Sidebar/Styles';
import {Icon, ProjectAvatar } from 'shared/components';
import PropTypes from 'prop-types';
import './styles.css';

export default function Login() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const history = useHistory();
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { authToken, name } = await api.post('/authentication/login', {
        id: username,
        password
      });
      storeAuthToken(authToken);
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('name', name);
      history.push('/projects');
    } catch (err) {
      setErrorMessage(err.message);
    }

  }
  if (!getStoredAuthToken()) {
  return (
    <div id="login" className="card">
      <div className="content">
        <ProjectInfo>
          <ProjectAvatar />
          <ProjectTexts>
            <ProjectName>DiMan</ProjectName>
            <ProjectCategory>Design Management</ProjectCategory>
          </ProjectTexts>
        </ProjectInfo>
        <h2> Login</h2>
        <div className="user">
          <input type="text" placeholder="User id" onChange={e => setUserName(e.target.value)} />
          <Icon type='board'></Icon>
          {/* <i className="fas fa-user"></i> */}
        </div>
        <div className="pass">
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          {/* <i className="fas fa-lock"></i> */}
          <Icon type='more' size={3}></Icon>
        </div>
        <div className="else">
          <span style={{ color: 'red', fontSize: '16px' }}>{errorMessage}</span>
        </div>
        <input type="submit" onClick={handleSubmit} />
      </div>
    </div>
  );
  } else {
    return <Projects></Projects>;
  }
}

Login.propTypes = {
};