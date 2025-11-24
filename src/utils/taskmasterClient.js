import axios from "axios";

const taskmasterClient = () =>
  axios.create({
    baseURL: process.env.TASKMASTER_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

export default taskmasterClient;