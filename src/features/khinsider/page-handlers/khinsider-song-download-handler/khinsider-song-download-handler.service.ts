import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import elementService from "../../../../shared/element/services/element/element.service.js";

class KhinsiderSongDownloadHandlerService {
  async getSongDownloadUrl(
    songDownloadPageUrl: string
  ): Promise<string | undefined> {
    const songDownloadPage = await puppeteerService.openWebSite(
      songDownloadPageUrl
    );
    const audioElement = await songDownloadPage.waitForSelector("audio", {
      visible: true,
    });

    if (!audioElement) {
      return;
    }

    const audioDownloadUrl =
      (audioElement &&
        ((await elementService.getElementHandlePropertyValue(
          "src",
          audioElement
        )) as string)) ||
      undefined;

    songDownloadPage.close();

    return audioDownloadUrl;
  }
}
export default new KhinsiderSongDownloadHandlerService();
