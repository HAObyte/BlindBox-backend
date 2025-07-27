// routes/box.js
const express = require("express");
const Prize = require("../models/Prize");
const multer = require("multer");

const router = express.Router();

// 获取所有奖品
router.get("/prizes", async (req, res) => {
    try {
        const prizes = await Prize.find();
        res.json(prizes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching prizes" });
    }
});
// 添加奖品 API，支持图片上传
router.post("/add", multer().single("image"), async (req, res) => {
    try {
        const { name, description, rarity } = req.body;
        const image = req.file.filename; // 获取上传的图片文件名

        // 创建奖品并保存
        const newPrize = new Prize({
            name,
            description,
            image,
            rarity,
        });

        await newPrize.save();
        res.json({ message: "Prize added successfully", prize: newPrize });
    } catch (err) {
        res.status(500).json({ message: "Error adding prize" });
    }
});

module.exports = router;
