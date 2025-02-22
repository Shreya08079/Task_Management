// controllers/taskController.js
const Task = require('../models/taskModel');  // Assuming you have a Task model for your tasks

// Function to create a new task
const createTask = async (req, res) => {
  try {
    const { assignor, ...taskInfo } = req.body;  // Get task info from the request body
    const { email } = req.currUser;  // Get the logged-in user's email

    taskInfo.assignor = email;  // Assign the task to the logged-in user

    const newTask = await Task.create(taskInfo);  // Create task in the database

    return res.status(201).json({
      status: 'success',
      data: { task: newTask },
    });
  } catch (err) {
    console.error('Error in creating task:', err);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

module.exports = { createTask };  // Export the createTask function
