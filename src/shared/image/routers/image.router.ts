import express from "express";
import imageController from "../controllers/image/image.controller.js";

const imageRouter = express.Router();

imageRouter.post("/images/load", imageController.getBase64ImagesFromImageUrls);

export default imageRouter;
