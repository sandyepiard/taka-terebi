import puppeteerService from "./src/core/puppeteer/services/puppeteer/puppeteer.service.js";
import allDebridHandlerService from "./src/features/all-debrid/services/all-debrid-handler/all-debrid-handler.service.js";
import darkiWorldHandlerService from "./src/features/darki-world/services/darki-world-handler/darki-world-handler.service.js";

const batmanSearchResults = await darkiWorldHandlerService.searchMediasTitles(
  "adibou"
);
console.log(batmanSearchResults);
// const leechedLink = await allDebridHandlerService.leechUrl(
//   "https://1fichier.com/?20zd8sv911uu7yr16oms&af=3394061"
// );
// console.log(leechedLink);

await puppeteerService.closeBrowser();
