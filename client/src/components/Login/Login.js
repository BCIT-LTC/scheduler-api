import React, { useState, useContext, useEffect } from 'react';
import './Login.css';
import { GlobalContext } from '../../context'
import Signup from '../signup/signup';

// Moved fetch request to inside the Login(). This sends the username and password as json to localhost:8080/login to get authenticated
export default function Login() {
  const context = useContext(GlobalContext)
  const [email, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [ showSignup, setShowSignup ] = useState(false)

  /* Session only stays an hour. New feature could be asking user to stay
  logging in when the time is up.*/
  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('token'));
    const expiration = new Date(localStorage.getItem('expiration'));

    if (token && expiration > new Date()) {
      // todo - this is breaking user login when the page is refreshed
      // this doesn't check if someone is admin, it assumes they are not
      // an additional check is required, check if token is valid with server and the user is admin
      context.updateUserData(null, token, false);
    } else {
      sessionStorage.removeItem('token');
      localStorage.removeItem('expiration');
    }
  }, []);

  const handleSubmit = (e) => {
    // Added 'e' parameter so that i can use e.preventDefault() since before I was getting page reload errors when trying to use fetch, this helps prevent it
    e.preventDefault();
    fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('error when submitting data', { cause: response })
        }
      })
      .then(data => {
        const expiration = new Date();
        console.log('updateUserData', data.email, data.token, data.isAdmin)
        context.updateUserData(data.email, data.token, Boolean(data.isAdmin))
        sessionStorage.setItem('token', JSON.stringify(data.token));
        sessionStorage.setItem('userEmail', JSON.stringify(data.email));
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toString());
      })
      .catch((err) => {
        console.error('handleSubmit', err)
      })
   }

  return(
    <>
    <div>
      {showSignup ? (
        <Signup />
      ):(
      <div className="login-wrapper">
          <form className="form" onSubmit={handleSubmit}>
            <h1>SIGN IN </h1>
            <label>
              <p>Email</p>
              <input type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
              <p>Password</p>
              <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div className="submit-button">
              <button type="submit">SIGN IN</button>
            </div>
            <p className="mt-4">
              New User?&nbsp;
              <button
                className="create-Link"
                onClick={()=> setShowSignup(true)}
              >
                Sign Up
              </button>
            </p>
            {/* <p>Forgot Password? <a href="/forgot">Reset</a></p> */}
          </form>
      </div>
      )}
    </div>
    </>

  )
}

