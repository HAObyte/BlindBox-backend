const express = require("express");
const router = express.Router();
const User = require("../models/User"); // 假设用户模型文件名为 User.js

router.post("/api/user/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: '用户名不存在' });
        }

        // 2. 验证密码（不加密，直接比较字符串）
        if (password!== user.password) {
            return res.status(401).json({ message: '密码错误' });
        }

        // 3. 生成 JWT token
        const token = generateToken(user._id); // 确保这个函数已定义

        // 4. 返回成功响应
        res.json({
            message: '登录成功',
            token,
            user: { id: user._id, username: user.username }
        });
    } catch (error) {
        res.status(500).json({ message: '服务器错误' });
    }
});

// 生成 JWT token 的函数
const generateToken = (userId) => {
    const jwt = require("jsonwebtoken");
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "1h", // 可以根据需求调整过期时间
    });
};

module.exports = router;