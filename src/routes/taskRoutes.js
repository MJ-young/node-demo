const express = require("express");
const taskController = require("../controllers/taskController");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.post("/", checkAuth, taskController.createTask);
router.get("/list", checkAuth, taskController.getTasks);
router.put("/", checkAuth, taskController.updateTask);
router.delete("/:id", checkAuth, taskController.deleteTask);

// 其他任务相关的路由定义

module.exports = router;
