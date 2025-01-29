import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";

const SERVICE_A_URL = "http://localhost:5001";
const SERVICE_B_URL = "http://localhost:5002";

export function registerRoutes(app: Express): Server {
  // Service A routes (Users)
  app.use("/api/users", async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${SERVICE_A_URL}/api/users${req.path}`,
        data: req.body,
        headers: req.headers,
      });
      res.status(response.status).json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
    }
  });

  // Service B routes (Posts)
  app.use("/api/posts", async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${SERVICE_B_URL}/api/posts${req.path}`,
        data: req.body,
        headers: req.headers,
      });
      res.status(response.status).json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}