import imageService from "../../../shared/image/services/image/image.service.js";
import digivolutionSimulatorService from "../services/digivolution-simulator/digivolution-simulator.service.js";
import { Request, Response } from "express";

class DigimonController {
  async getNewDigimon(req: Request, res: Response): Promise<void> {
    const newDigimon = await digivolutionSimulatorService.getNewDigimon();

    // await puppeteerService.closeBrowser();

    res.send(newDigimon);
  }

  async setAndGetDigivolvedDigimon(req: Request, res: Response): Promise<void> {
    const digimon = req.body.digimon;
    await digivolutionSimulatorService.setDigimonToNextDigivolution(digimon);

    // await puppeteerService.closeBrowser();
  }
}
export default new DigimonController();
