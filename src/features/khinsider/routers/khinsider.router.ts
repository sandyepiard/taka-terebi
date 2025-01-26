import express from "express";
import khinsiderController from "../controllers/khinsider.controller.js";

const khinsiderRouter = express.Router();

khinsiderRouter.get(
  "/khinsider/album/songs/links",
  khinsiderController.getAllSongsDownloadLinksOfAlbum
);

export default khinsiderRouter;
