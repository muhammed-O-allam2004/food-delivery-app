import express from "express";
import { addFitnessItem, listFitnessItems, removeFitnessItem } from "../controllers/fitnessController.js";
import multer from "multer"; 

const fitnessRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage})

fitnessRouter.post("/add", upload.single("image"), addFitnessItem)
fitnessRouter.get("/list", listFitnessItems)
fitnessRouter.post("/remove", removeFitnessItem)

export default fitnessRouter;