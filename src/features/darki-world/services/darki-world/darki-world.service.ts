import { Page } from "puppeteer";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";

class DarkiWorldService {
  private readonly siteUrl = "https://darkiworld.org/";
  private pageInstance?: Page;

  private async getPageInstance(): Promise<Page> {
    if (this.pageInstance) {
      return this.pageInstance;
    }

    const { siteUrl } = this;

    const page = await puppeteerService.openWebSite(siteUrl);
    this.pageInstance = page;

    return page;
  }

  async searchMediasTitles(searchQuery: string): Promise<string[]> {
    const page = await this.getPageInstance();

    const searchInputQueryPathSelector = ".items-center input";
    const searchInputElement = await page.locator(searchInputQueryPathSelector);

    const searchInputElementAsInput = await searchInputElement.waitHandle();
    await searchInputElementAsInput.type(searchQuery);
    await searchInputElementAsInput.press("Enter");

    const mediasElementsSelector = ".content-grid-portrait .text-sm a";
    await page.waitForSelector(mediasElementsSelector, {
      visible: true,
    });

    const mediasTitles = await page.$$eval(mediasElementsSelector, (elements) =>
      elements.map((el) => el.innerHTML)
    );

    return mediasTitles;
  }
}
export default new DarkiWorldService();
