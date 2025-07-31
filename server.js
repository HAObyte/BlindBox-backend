const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析表单数据

// 生成唯一订单号
function generateOrderNumber() {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${timestamp}${random}`;
}

// 1. 提交订单API
app.post('/api/orders', async (req, res) => {
    try {
        // 从请求体获取订单数据
        const { product_name, quantity, price, user_id, address } = req.body;

        // 验证必要字段
        if (!product_name || !quantity || !price || !user_id || !address) {
            return res.status(400).json({
                success: false,
                message: '缺少必要的订单信息'
            });
        }

        // 计算总价
        const total = price * quantity;
        // 生成订单号
        const order_number = generateOrderNumber();

        // 插入数据库
        const [result] = await pool.execute(
            `INSERT INTO orders (
        order_number, product_name, quantity, price, total, 
        user_id, address, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
            [order_number, product_name, quantity, price, total, user_id, address]
        );

        // 返回成功响应
        res.status(201).json({
            success: true,
            orderId: result.insertId,
            orderNumber: order_number
        });

    } catch (error) {
        console.error('提交订单失败：', error);
        res.status(500).json({
            success: false,
            message: '服务器错误，订单提交失败'
        });
    }
});

// 2. 获取订单列表API
app.get('/api/orders', async (req, res) => {
    try {
        // 从查询参数获取用户ID
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: '缺少用户ID'
            });
        }

        // 查询该用户的所有订单
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [user_id]
        );

        // 返回订单列表
        res.json({
            success: true,
            orders: orders
        });

    } catch (error) {
        console.error('获取订单失败：', error);
        res.status(500).json({
            success: false,
            message: '服务器错误，获取订单失败'
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`后端服务器已启动，运行在 http://localhost:${PORT}`);
});