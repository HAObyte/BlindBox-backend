// routes/box.js
const express = require("express");
const Prize = require("../models/Prize");

const router = express.Router();

// 获取一个随机奖品
router.get("/draw", async (req, res) => {
    try {
        const prizes = [
            { name: "限量版手机", description: "最新款的限量手机！", image: "/images/phone.jpg" },
            { name: "高端耳机", description: "一副高质量的耳机。", image: "/images/headphones.jpg" },
            { name: "电影票", description: "两张最新电影票！", image: "/images/tickets.jpg" },
            { name: "神秘礼品", description: "一个神秘的奖品，等待揭晓！", image: "/images/mystery.jpg" },
        ];

        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        res.json(randomPrize); // 返回随机奖品
    } catch (err) {
        res.status(500).json({ message: "Error during draw" });
    }
});

module.exports = router;
