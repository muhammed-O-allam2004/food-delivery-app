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
import fitnessRouter from "./routes/fitnessRoute.js"

const app = express()
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

connectDB()

app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/ai", aiRouter) 
app.use("/api/recipe", recipeRouter) 
app.use("/api/fitness", fitnessRouter)

app.get("/", (req, res) => {
    res.send("API Working")
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})