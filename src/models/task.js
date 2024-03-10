const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user: { type: String, required: true },
  taskName: { type: String, required: true },
  taskDesc: { type: String, required: true },
  taskType: { type: String, required: true },
  taskStatus: { type: String, required: true },
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
  // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
