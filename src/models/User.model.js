// backend/src/models/User.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);

// backend/src/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

module.exports = generateToken;

// backend/src/controllers/auth.controller.js
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// 注册用户
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 检查用户是否存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 创建新用户
        const user = await User.create({
            username,
            password: hashedPassword,
        });

        // 生成token
        const token = generateToken(user._id);

        res.status(201).json({
            user: { id: user._id, username: user.username },
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
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }

        // 生成token
        const token = generateToken(user._id);

        res.json({
            user: { id: user._id, username: user.username },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: '登录失败', error: error.message });
    }
};

module.exports = { registerUser, loginUser };

// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

// backend/src/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 连接数据库
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB连接错误:'));
db.once('open', () => {
    console.log('MongoDB已连接');
});

// 路由
app.use('/api/auth', authRoutes);

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});