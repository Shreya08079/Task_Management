const express = require("express");
const { createTask } = require("../controllers/taskController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createTask);

module.exports = router;
