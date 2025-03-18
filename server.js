require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sales = require("./MODELS/Sales");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing in .env file!");
    process.exit(1);
}

console.log("🔗 Connecting to MongoDB...");

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log("✅ Connected to MongoDB Atlas - SALES_DB"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});

app.get("/", (req, res) => {
    res.send("Welcome to the Sales Management API!");
});

app.post("/sales", async (req, res) => {
    try {
        const { product, amount } = req.body;
        if (!product || !amount) {
            return res.status(400).json({ message: "Product and amount are required!" });
        }

        const newSale = new Sales({ product, amount });
        await newSale.save();
        res.status(201).json({ message: "Sale recorded successfully!", sale: newSale });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));