import taskmasterClient from "../utils/taskmasterClient.js";
import mongoose, { isValidObjectId } from "mongoose";
export const getAllTasks = async (req, res) => {
  try {
    const response = await taskmasterClient().get(`/api/v1/task/all`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in Sentinel getAllTask:", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.message || "TaskMaster error",
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTask = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }

        const response = await taskmasterClient().get(`/api/v1/task/${id}`);
        res.status(200).json(response.data);
    } catch(error) {
        console.error("Error in Sentinel getTask:", error.message);
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || "TaskMaster error",
            });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addTask = async (req, res) => {
    try {
        const response = await taskmasterClient().post(`/api/v1/task/add`, req.body);
        res.status(200).json(response.data);
    } catch(error) {
        console.error("Error in Sentinel addTask:", error.message);
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || "TaskMaster error",
            });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }

        const response = await taskmasterClient().put(`/api/v1/task/update/${id}`, req.body);
        res.status(200).json(response.data);
    } catch(error) {
        console.error("Error in Sentinel updateTask:", error.message);
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || "TaskMaster error",
            });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateTime = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }
        const response = await taskmasterClient().patch(`/api/v1/task/time/${id}`, req.body);
        res.status(200).json(response.data);
    } catch(error) {
        console.error("Error in Sentinel updateTime controller", error.message);
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || "TaskMaster error",
            })
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }
        const response = await taskmasterClient().delete(`/api/v1/task/delete/${id}`);
        res.status(200).json(response.data);
    } catch(error){
        console.error("Error in Sentinel deleteTask:", error.message);
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || "TaskMaster error",
            });
        }
        return res.status(500).json({ message: "Internal Server Error" });  
    }
};
