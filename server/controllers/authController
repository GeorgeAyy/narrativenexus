// Import necessary modules and dependencies
const bcrypt = require('bcrypt');
const UserModel = require('../models/User'); // You should have a UserModel defined for working with your MongoDB user data

// Controller function for user login
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email in your MongoDB database
      const user = await UserModel.findOne({ email });
  
      console.log('User found:', user);
  
      // If the user is not found, send an error response
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      console.log('Password validation result:', isPasswordValid);
  
      // If the password is not valid, send an error response
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // If the email and password are valid, create a session
      req.session.user = {
        _id: user._id,
        name: user.name, // Include the user's name in the session data
        email: user.email, // Include the user's email in the session data
        // Add any other user-related data you want to store in the session
      };
  
      console.log('Session created:', req.session.user);
      // Send a success response
      res.cookie('user', req.session.user, { maxAge: 3600000 }, { path: '/'})
      res.status(200).json({ message: 'User logged in successfully', user: req.session.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

// Controller function for user logout
exports.logout = (req, res) => {
  try {
    // Destroy the session to log the user out
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging out' });
      } else {
        res.clearCookie('connect.sid'); // Clear the session cookie
       res.sendStatus(200);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function for user signup
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    const errors = {}; // Initialize an empty object to store validation errors
  
    try {
      // Validation checks
      if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
  
      if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one uppercase character';
      }
  
      if (name.length < 5) {
        errors.name = 'Name must be at least 5 characters long';
      }
  
      if (!isValidEmail(email)) {
        errors.email = 'Invalid email format';
      }
  
      // Check if any validation errors occurred
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors }); // Send the errors object to the client
      }
  
      // Check if a user with the same email already exists in the database
      const existingUser = await UserModel.findOne({ email });
  
      // If a user with the same email exists, send an error response
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
  
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user document and save it to the database
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        // Add any other user-related data you want to store in the database
      });
  
      await newUser.save();
  
      // Send a success response
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error("[SIGNUP] Error while signing up:", error);
      res.status(500).json({ error: error.message });
    }
  };
  exports.checkOut = async (req, res) => {
    if (req.session.user) {
        res.json({authenticated: true});
    } else {
        res.json({authenticated: false});
    }
    };
  // Function to validate email format
  function isValidEmail(email) {
    // Use a regular expression to check if the email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  