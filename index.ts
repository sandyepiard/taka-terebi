import puppeteerService from "./src/core/puppeteer/services/puppeteer/puppeteer.service.js";
import digimonFandomHandlerService from "./src/features/digimon-fandom/page-handlers/digimon-fandom-handler/digimon-fandom-handler.service.js";

const freshLevelDigimons =
  await digimonFandomHandlerService.getFreshLevelDigimons();
console.log(freshLevelDigimons);

await puppeteerService.closeBrowser();
