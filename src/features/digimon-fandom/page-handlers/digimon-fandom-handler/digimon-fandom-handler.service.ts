import { Page } from "puppeteer";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import {
  BaseDigimon,
  digimonFandomSiteUrl,
} from "../../types/digimon-fandom.types.js";

class DigimonFandomHandlerService {
  private readonly siteUrl = digimonFandomSiteUrl;
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
}
export default new DigimonFandomHandlerService();
