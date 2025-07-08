const cloudinary = require("../utils/cloudinary");
const Task = require("../models/task.model");
const createTask =  async (req, res, next) => {
    try {
      const { title, description, completed } = req.body;

      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
      let imageUrl = null;

      // If there's a file in the request
      if (req.file) {
        const streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "task-images" },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };

        const result = await streamUpload(req);
        imageUrl = result.secure_url;
      }

      const new_task = new Task({
        title,
        description,
        completed,
        owner: req.user.user_id,
        image: imageUrl,
      });

      await new_task.save();

      return res.status(200).json({ message: "Task added successfully" });
    } catch (error) {
      console.log({ error });
      error.statusCode = 400;
      next(error);

      return  res.status(500).json({ error });
    }
  }

  const deleteTask= async (req, res) => {
  try {
    const id = req.params.id;

    // check if task id was provided
    if (!id) {
      return res.status(400).json({ message: "Task id not found" });
    }

    // ✅ FIXED: remove `new` and make sure to `await` the DB call
    const foundTask = await Task.findById(id);

    if (!foundTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ check task ownership
    if (String(foundTask.owner) !== String(req.user.user_id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete the task
    await foundTask.deleteOne(); // or foundTask.deleteOne();

    return res.json({ message: "Task deleted" });
  } catch (error) {
    console.error({ error });
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

const updateTask =async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const id = req.params.id;

    // check if task id was provided
    if (!id) {
      return res.status(400).json({ message: "Task id not found" });
    }

    // ✅ FIXED: remove `new` and make sure to `await` the DB call
    const foundTask = await Task.findById(id);

    if (!foundTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ check task ownership
    if (String(foundTask.owner) !== String(req.user.user_id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ update only provided fields
    if (title !== undefined) foundTask.title = title;
    if (description !== undefined) foundTask.description = description;
    if (completed !== undefined) foundTask.completed = completed;

    // ✅ save the changes
    await foundTask.save();

    return res.json({ message: "Task updated", task: foundTask });
  } catch (error) {
    console.error({ error });
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

const getTasks= async(req, res) => {
  try {
    const { completed, page = 1, limit = 10, search } = req.query;
    let query = { };
    console.log(req.user);
    
    if(req.user.role != "admin"){
        query = { owner: req.user.user_id }
    }

    if (completed) {
      query.completed = completed == "true";
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const foundTask = await Task.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    if (foundTask.length === 0) {
      return res.status(400).json({ message: "Task not found" });
    }

    return res.json({
      message: "Task found",
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      task: foundTask,
    });
  } catch (error) {
    console.error({ error });
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

  module.exports ={createTask,deleteTask,updateTask,getTasks}