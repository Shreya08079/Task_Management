const express = require("express");
const { createTask, getTasks,updateTaskStatus,deleteTask} = require("../controllers/taskController");
// const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getTasks);
router.patch("/:id", updateTaskStatus);
router.delete("/:id", deleteTask);
router.post("/", createTask);

module.exports = router;
