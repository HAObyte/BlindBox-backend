// src/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const { findUserByUsername, createUser } = require('../memoryUsers');
const generateToken = require('../utils/generateToken');

// 注册用户
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 检查用户是否存在
        const existingUser = findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 创建新用户
        const user = createUser(username, password);

        // 生成token
        const token = generateToken(user.username);

        res.status(201).json({
            user: { username: user.username },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: '注册失败', error: error.message });
    }
};

// 用户登录
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 查找用户
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }

        // 验证密码
        if (password!== user.password) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }

        // 生成token
        const token = generateToken(user.username);

        res.json({
            user: { username: user.username },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: '登录失败', error: error.message });
    }
};

module.exports = { registerUser, loginUser };