// controllers/taskController.js
const Task = require('../models/taskModel.js');  // Assuming you have a Task model for your tasks

 const createTask = async (req, res) => {
  try {
      const { taskTitle, assignee, deadline, priority } = req.body;

      // Basic validation
      if (!taskTitle || !assignee || !deadline) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      console.log("Request body:", req.body);  // Debug log to check the incoming data

      const newTask = new Task({
          taskTitle,
          assignee,
          deadline,
          priority,
      });

      // Save task to the database
      await newTask.save();

      console.log("Created task:", newTask);  // Debug log to verify saved task
      res.status(201).json(newTask);  // Return created task
  } catch (error) {
      console.error("Error creating task:", error);  // More detailed backend logging
      res.status(500).json({ error: "Failed to create task" });
  }
};




const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ status: "success", data: { tasks } });  // Ensure correct format
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Update task status
 const updateTaskStatus = async (req, res) => {
  try {
      const { status } = req.body;
      if (!["todo", "done"].includes(status)) {
          return res.status(400).json({ error: "Invalid status" });
      }
      await Task.findByIdAndUpdate(req.params.id, { status });
      res.json({ status: "success" });
  } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
      await Task.findByIdAndDelete(req.params.id);
      res.status(204).send();
  } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = { createTask,getTasks,updateTaskStatus, deleteTask};  // Export the createTask function
