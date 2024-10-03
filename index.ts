import puppeteerService from "./src/core/puppeteer/services/puppeteer/puppeteer.service.js";
import darkiWorldService from "./src/features/darki-world/services/darki-world/darki-world.service.js";

const batmanSearchResults = await darkiWorldService.searchMediasTitles(
  "batman"
);
console.log(batmanSearchResults);

await puppeteerService.closeBrowser();
