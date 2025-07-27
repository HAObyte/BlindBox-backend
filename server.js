// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();

// 使用中间件
app.use(cors());
app.use(express.json()); // 解析 JSON 数据
app.use(express.static("uploads")); // 使上传的图片可访问

// 设置文件上传存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // 指定上传文件存储目录
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // 使用时间戳 + 原始文件名来命名文件
    },
});

const upload = multer({ storage: storage });

// 连接 MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// 路由
const boxRoutes = require("./routes/box");
app.use("/api/box", boxRoutes);

// 监听端口
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
