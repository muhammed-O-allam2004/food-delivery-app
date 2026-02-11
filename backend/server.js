import 'dotenv/config' 
import express from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import aiRouter from "./routes/aiRoute.js" 
import recipeRouter from "./routes/recipeRoute.js" 
import fitnessRouter from "./routes/fitnessRoute.js" // ✅ 1. استيراد ملف الراوت الجديد

// app config
const app = express()
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json())
app.use(cors())

// Request Logger
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// db connection
connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/ai", aiRouter) 
app.use("/api/recipe", recipeRouter) 
app.use("/api/fitness", fitnessRouter) // ✅ 2. تفعيل رابط الفيتنس الجديد

app.get("/", (req, res) => {
    res.send("API Working")
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})