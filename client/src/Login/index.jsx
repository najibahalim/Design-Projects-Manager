import React, { useState } from 'react';
import toast from 'shared/utils/toast';
import api from 'shared/utils/api';
import {
  ProjectName,
  ProjectTexts,
  ProjectInfo,
  ProjectCategory, } from '../Projects/Sidebar/Styles';
import {ProjectAvatar } from 'shared/components';
import PropTypes from 'prop-types';
import './styles.css';

async function loginUser(credentials) {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json()).catch(err => { throw err; })
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    try {

      const { authToken } = await api.post('/authentication/login', {
        username,
        password
      });

      setToken(authToken);
    } catch (err) {
      setErrorMessage(err.message);
    }

  }

  return (

    <div className="card">
      <div className="content">
        <ProjectInfo>
          <ProjectAvatar />
          <ProjectTexts>
            <ProjectName>Demaneistic</ProjectName>
            <ProjectCategory>Design Management</ProjectCategory>
          </ProjectTexts>
        </ProjectInfo>
        <h2> Please Login</h2>
        <div className="user">
          <input type="text" placeholder="Username" onChange={e => setUserName(e.target.value)} />
          <i className="fas fa-user"></i>
        </div>
        <div className="pass">
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <i className="fas fa-lock"></i>
        </div>
        <div className="else">
          <span style={{ color: 'red' }}>{errorMessage}</span>
        </div>
        <input type="submit" onClick={handleSubmit} />
      </div>
    </div>



    // <div className="login-wrapper">
    //   <h1>Please Log In</h1>
    //   <form onSubmit={handleSubmit}>
    //     <label>
    //       <p>Username</p>
    //       <input type="text" onChange={e => setUserName(e.target.value)} />
    //     </label>
    //     <label>
    //       <p>Password</p>
    //       <input type="password" onChange={e => setPassword(e.target.value)} />
    //     </label>
    //     <div>
    //       <p style={{color:'red'}}>{errorMessage}</p>
    //       <button type="submit">Submit</button>
    //     </div>
    //   </form>
    // </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};