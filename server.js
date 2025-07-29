const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./src/routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

// 替换为你的MongoDB连接
mongoose.connect('mongodb://localhost:27017/blindbox', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3001, () => {
    console.log('Backend running on port 3001');
});