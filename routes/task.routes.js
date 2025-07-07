const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
const Task = require("../models/task.model");

// (GET, PUT, DELETE)
router.post("/create-task", authMiddleware, async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const new_task = new Task({
      title,
      description,
      completed,
      owner: req.user.user_id,
    });

    await new_task.save();

    return res.status(200).json({ message: "Task added successfully" });
  } catch (error) {
    console.log({ error });

    return res.status(500).json({ error });
  }
});

router.put("/update-task/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const id =req.params.id
 
    

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
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/delete-task/:id", authMiddleware, async (req, res) => {
  try {
   
    const id =req.params.id

    

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
    await foundTask.deleteOne();  // or foundTask.deleteOne();

    return res.json({ message: "Task deleted" });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/get-tasks", authMiddleware, async(req, res)=>{
    try {
        const foundTask = await Task.find({owner:req.user.user_id})
        if(foundTask.length === 0){
            return res.status(400).json({ message: "Task not found" });
        }

        return res.json({ message: "Task found", task: foundTask });
    } catch (error) {
         console.error({ error });
    return res.status(500).json({ message: "Server error", error: error.message });
    }
})

module.exports = router;



//  Bonus Challenges (Optional)
// Implement logout by clearing token

// Add due date to Task schema

// Add pagination to GET /tasks

// Deploy your backend to Render