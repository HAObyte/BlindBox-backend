const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());
// 挂载路由
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});