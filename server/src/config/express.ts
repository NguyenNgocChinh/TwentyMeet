import express from "express";
import cors from "cors";

export const initializeExpress = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  return app;
};
