import express from "express";
import digimonController from "../controllers/digimon.controller.js";
import bodyParser from "body-parser";

const digimonRouter = express.Router();

digimonRouter.get("/digimon/new", digimonController.getNewDigimon);
digimonRouter.post(
  "/digimon/digivolve",
  bodyParser.json(),
  digimonController.setAndGetDigivolvedDigimon
);

export default digimonRouter;
