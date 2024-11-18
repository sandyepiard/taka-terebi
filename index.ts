import puppeteerService from "./src/core/puppeteer/services/puppeteer/puppeteer.service.js";
import allDebridHandlerService from "./src/features/all-debrid/services/all-debrid-handler/all-debrid-handler.service.js";
import darkiWorldHandlerService from "./src/features/darki-world/page-handlers/darki-world-handler/darki-world-handler.service.js";
import darkiWorldMediaHandlerService from "./src/features/darki-world/page-handlers/darki-world-media-handler/darki-world-media-handler.service.js";

const batmanSearchResults = await darkiWorldHandlerService.searchMedias(
  "batman"
);
console.log(batmanSearchResults);

const batman1989Film = batmanSearchResults["Film"].find(
  (media) => media.title === "Batman"
);
if (batman1989Film) {
  const mediasInfos = await darkiWorldMediaHandlerService.getPageMediaInfos(
    batman1989Film
  );
}

// const leechedLink = await allDebridHandlerService.leechUrl(
//   "https://1fichier.com/?20zd8sv911uu7yr16oms&af=3394061"
// );
// console.log(leechedLink);

await puppeteerService.closeBrowser();
