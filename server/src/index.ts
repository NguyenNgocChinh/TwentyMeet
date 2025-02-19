import { createApp } from "./app";

const PORT = process.env.PORT || 3001;
const server = createApp();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Xử lý lỗi server
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
