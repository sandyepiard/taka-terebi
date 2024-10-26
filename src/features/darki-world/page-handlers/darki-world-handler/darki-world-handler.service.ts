import { Page } from "puppeteer";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import darkiWorldSearchResultHandlerService from "../darki-world-search-result-handler/darki-world-search-result-handler.service.js";
import darkiWorldMediaService from "../../services/darki-world-media/darki-world-media.service.js";
import { Media } from "../../types/darki-world.types.js";

class DarkiWorldHandlerService {
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

  async searchMedias(searchQuery: string): Promise<Media[][]> {
    const page = await this.getPageInstance();

    const medias =
      await darkiWorldSearchResultHandlerService.getSearchMediasResult(
        searchQuery,
        page
      );

    return medias;
  }

  async searchMediasTitles(searchQuery: string): Promise<string[]> {
    const page = await this.getPageInstance();

    const medias = await this.searchMedias(searchQuery);

    const flatMedias = medias.flatMap((mediasByMediaType) => mediasByMediaType);

    const mediasTitles =
      darkiWorldMediaService.mapMediasToMediaTitle(flatMedias);

    return mediasTitles ?? [];
  }

  async getAvailableDownloadInfosOfMedia(media: Media): Promise<any> {}
}
export default new DarkiWorldHandlerService();
