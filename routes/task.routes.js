const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
const upload = require("../middleware/multer.middleware");
const validate = require("../middleware/validate.middleware");

const { createTaskSchema } = require("../validators/task.validator");
const checkRole = require("../middleware/role.middleware");
const {
  createTask,
  deleteTask,
  updateTask,
  getTasks,
} = require("../controllers/tasks.controllers");

// (GET, PUT, DELETE)
router.post(
  "/create-task",
  authMiddleware,
  checkRole(["user", "admin"]),
  upload.single("image"),
  validate(createTaskSchema),
  createTask
);

router.put("/update-task/:id", authMiddleware, updateTask);

router.delete("/delete-task/:id", authMiddleware, deleteTask);

router.get("/get-tasks", authMiddleware, getTasks);

module.exports = router;
