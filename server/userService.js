// userService.js
const User = require('./User.js'); // Import the User model from your schema file
const mongoose = require('mongoose');
class UserService {
  static async createUser(name, email, password) {
    try {
      // Create a new user

      User.create({ name, email,password});
      
      // Save the user to the database
      

    } catch (error) {
      // Handle database save error (e.g., duplicate email)
      throw error; // You can handle this error in the calling code
    }
  }

  // You can add more user-related methods here, like getUserById, updateUser, etc.
}

module.exports = UserService;
