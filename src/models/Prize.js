
const mongoose = require("mongoose");

const prizeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // 存储图片文件名
    rarity: { type: String, required: true }, // 奖品稀有度
});

const Prize = mongoose.model("Prize", prizeSchema);

module.exports = Prize;
