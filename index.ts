import puppeteerService from "./src/core/puppeteer/services/puppeteer/puppeteer.service.js";
import digivolutionSimulatorService from "./src/features/digimon-fandom/services/digivolution-simulator/digivolution-simulator.service.js";

// const levels = await digimonFandomLevelHandlerService.getLevels();
// console.log(levels);
const newDigimon = await digivolutionSimulatorService.getNewDigimon();
// console.log(newFreshLevelBaseDigimon);

while (newDigimon && !!newDigimon.currForm.nextForms.length) {
  await digivolutionSimulatorService.setDigimonToNextDigivolution(newDigimon);
}

await puppeteerService.closeBrowser();
