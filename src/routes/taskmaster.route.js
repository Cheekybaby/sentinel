import express from "express";
import {
  getAllTasks,
  getTask,
  addTask,
  updateTask,
  updateTime,
  deleteTask,
} from "../controllers/taskmaster.controller.js";

const router = express.Router();

router.get("/all", getAllTasks);
router.get("/:id", getTask);
router.post("/add", addTask);
router.put("/update/:id", updateTask);
router.patch("/time/:id", updateTime);
router.delete("/delete/:id", deleteTask);

export default router;
