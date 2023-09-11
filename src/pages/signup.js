import React, { useState } from 'react';
import '../styles/signup.css'; // Import your custom CSS

import { useHistory, Link } from 'react-router-dom';
import config from '../config.json';
const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    let isValid = true;

    if (name.length < 5) {
      setNameError('Name must be at least 5 characters.');
      isValid = false;
    } else {
      setNameError('');
    }

    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailPattern.test(email)) {
      setEmailError('Invalid email format.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must include at least one capital letter.');
      isValid = false;
    } else if (!/\d/.test(password)) {
      setPasswordError('Password must include at least one number.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      try {
        const data = {
          name: name,
          email: email,
          password: password,
        };

        // Create the user using the UserService
        fetch(`http://${config.ip}:5000/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Registration failed. Please try again.');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);

            // Optionally, you can redirect the user to a different page
            // or display a success message in your component.

            // Reset the form fields (as shown in comments).
            setName('');
            setEmail('');
            setPassword('');
          })
          .catch((error) => {
            // Handle registration error and set the corresponding error state
            if (error.message === 'Name must be at least 5 characters.') {
              setNameError(error.message);
            } else if (error.message === 'Invalid email format.') {
              setEmailError(error.message);
            } else if (
              error.message === 'Password must be at least 8 characters.' ||
              error.message === 'Password must include at least one capital letter.' ||
              error.message === 'Password must include at least one number.'
            ) {
              setPasswordError(error.message);
            } else {
              // Handle other errors, if needed
              setEmailError('Email already taken.');
            }
          });
      } catch (error) {
        // Handle other errors, if needed
        setEmailError('Email already taken.');
      }
    }
  };

  return (
    <div className="signup-container">
      <button className="btn1" onClick={() => history.push("/")}>
        Home
      </button>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input

            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="input-field"
          />
          <label htmlFor="input-field" className="input-label">
            Your Name
          </label>
          <span className="input-highlight"></span>
        </div>
        <div className="error-message">{nameError}</div>

        <div className="input-container">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="input-field"
          />
          <label htmlFor="input-field" className="input-label">
            Your Email
          </label>
          <span className="input-highlight"></span>
        </div>
        <div className="error-message">{emailError}</div>

        <div className="input-container">
          <input
            type={showPassword ? 'text' : 'password'} // Toggle input type
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            className="input-field"
          />
          <label htmlFor="input-field" className="input-label">
            Your Password
          </label>
          <span className="input-highlight"></span>
          {/* Eye icon to toggle password visibility */}
          <label className="container">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <svg className="eye" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
              <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
            </svg>
            <svg className="eye-slash" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
              <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"></path>
            </svg>
          </label>
        </div>

        <div className="error-message">{passwordError}</div>

        <button type="submit" className="underlinebutton">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
