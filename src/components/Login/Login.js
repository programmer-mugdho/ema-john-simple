import React, { useState, useContext } from 'react';

import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, handleFBLogin } from './LoginManager';


function Login() {
  const [user, setUser] = useState({
    isSignedIn: false,
    user: '',
    email: '',
    photoURL: '',
    error: '',
    success: false
  })
  initializeLoginFramework()
  const [loggedInUser, setLoggedInUser] = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let { from } = location.state || { from: { pathname: '/' } }

  const googleSignIn = () => {
    handleGoogleSignIn()
      .then(res => {
        setUser(res)
        setLoggedInUser(res)
      })
  }
  const [newUser, setNewUser] = useState(false)

  const signOut = () => {
    handleSignOut()
      .then(res => {
        setUser(res)
        loggedInUser(res)
      })
  }

  const fbLogin = () => {
    handleFBLogin()
      .then(res => {
        setUser(res)
        loggedInUser(res)
      })
  }

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value)
      isFieldValid = isPasswordValid && passwordHasNumber
    }
    if (isFieldValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo)
    }
  }

  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
    if (newUser && user.email && user.password) {

    }
    if (!newUser && user.email && user.password) {

    }
    e.preventDefault()
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {
        user.isSignedIn ? <button onClick={signOut}>Sign Out</button> :
          <button onClick={googleSignIn}>Sign In</button>
      }
      <br />
      {
        <button onClick={fbLogin}>Sign In Using Facebook</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photoURL} alt={user.name} />
        </div>
      }
      <h1>Our Own Authentication System</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>

      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" placeholder='Your name' onBlur={handleBlur} />}
        <br />
        <input type="text" name="email" onBlur={handleBlur} required placeholder='Your Email Address' />
        <br />
        <input type="password" name="password" onBlur={handleBlur} required placeholder="Your Password" />
        <br />
        <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}
    </div>
  );
}

export default Login;
