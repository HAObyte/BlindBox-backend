const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(3001, () => {
    console.log('Backend running on port 3001');
});