const User = require('../models/userModel');

// *--------------------------------
// * Logic for Login
// *--------------------------------

const login = async (req, res, next) => {

  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });

    // console.log("Data received from frontend: ",phoneNumber, password)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ❗ Prevent login if user is inactive
    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'Your account is inactive. Please contact the administrator.',
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        phoneNumber: phoneNumber
      },
    });
  } catch (error) {
    next(error);
  }

};


// *--------------------------------
// * Getting the current loggedin user
// *--------------------------------

const getCurrentUser = async (req, res) => {
  try {
    const userData = req.user;
    // console.log("User data",userData)
    res.status(200).json({ userData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};


// *--------------------------------
// * Logic for adding Staff
// *--------------------------------

// Code for creating addStaff in the database addStaff folder/collection

const addStaff = async (req, res) => {
  try {
    const { fullName, phoneNumber, role, address, email, salary } = req.body;

    // Create a new User instance
    const newStaff = new User({
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      role: role,
      address: address,
      salary: salary,
      password: 123,
    });

    // console.log(newStaff);

    // Save the User to the database
    const savedStaff = await newStaff.save();

    // console.log(savedStaff);

    // Send a success response
    res.status(201).json({
      message: 'Staff added successfully',
      staff: savedStaff,
    });
  } catch (error) {
    // console.log(error);

    // Handle errors
    res.status(500).json({
      message: 'Error adding Staff',
      error: error.message,
    });
  }
};




// *--------------------------------
// * Get All Users
// *--------------------------------
const getAllStaff = async (req, res, next) => {
  try {
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied' });
    // }
    const users = await User.find();
    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    next(error);
  }
};

// *--------------------------------
// * Mark as inactive
// *--------------------------------

const deactivateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findById(id);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    staff.status = "inactive";
    await staff.save();

    res.status(200).json({ message: "Staff member deactivated successfully." });
  } catch (error) {
    console.error("Error deactivating staff:", error);
    res.status(500).json({ error: "Failed to deactivate staff member." });
  }
};

// *--------------------------------
// * Reactivating staff
// *--------------------------------

const reactivateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findById(id);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    staff.status = "active";
    await staff.save();

    res.status(200).json({ message: "Staff member reactivated successfully." });
  } catch (error) {
    console.error("Error reactivating staff:", error);
    res.status(500).json({ error: "Failed to reactivate staff member." });
  }
};

// *--------------------------------
// * Delete a User by ID
// *--------------------------------
const deleteStaff = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

// *--------------------------------
// * Update a User by ID
// *--------------------------------
const updateStaff = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // return updated document
      runValidators: true, // run schema validators
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

module.exports = {
  login,
  addStaff,
  getAllStaff,
  deleteStaff,
  updateStaff,
  deactivateStaff,
  reactivateStaff,
  getCurrentUser
};