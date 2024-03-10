const Task = require("../models/task");

exports.createTask = async (req, res) => {
  const userId = req.userId; // 从session中获取用户ID
  try {
    const task = new Task({
      user: userId,
      taskName: req.body.taskName,
      taskDesc: req.body.taskDesc,
      taskType: req.body.taskType,
      taskStatus: req.body.taskStatus,
    });
    await task.save();
    res.status(200).json({
      data: { task },
      message: "Task created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

exports.getTasks = async (req, res) => {
  const userId = req.userId; // 从session中获取用户ID
  const { pageNum = 1, pageSize = 10 } = req.query;
  try {
    //  搜索到的用户的总任务数
    const total = await Task.find({ user: userId }).countDocuments();
    // 从数据库中查找用户的任务,按照修改时间倒序排列
    const tasklist = await Task.find({ user: userId })
      .sort({ updateTime: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(Number(pageSize));
    res.status(200).json({
      data: {
        tasklist,
        total,
      },
      message: "Task list fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task list",
    });
  }
};

// 更新任务
exports.updateTask = async (req, res) => {
  const { _id, ...updateData } = req.body;

  if (!_id) {
    return res.status(400).json({
      message: "Task ID is required",
    });
  }

  try {
    // 使用 findByIdAndUpdate 方法更新任务
    // 第一个参数是 _id 用于查找文档
    // 第二个参数是需要更新的数据
    // 第三个参数 { new: true } 会返回更新后的文档，默认情况下 Mongoose 返回更新前的文档
    const updatedTask = await Task.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      data: { updatedTask },
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// 删除任务
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      data: { task },
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};
