import { Page } from "puppeteer";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import { Media, MediaType } from "../../types/darki-world.types.js";

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

    //Récupération de l'input de recherche dans la apge
    const searchInputQueryPathSelector = ".items-center input";
    const searchInputElement = await page.locator(searchInputQueryPathSelector);

    //On convertit l'input locator en element handle pour pouvoir écrire dans l'input et
    //Utiliser la touche entrer dans l'input
    const searchInputElementAsInput = await searchInputElement.waitHandle();
    await searchInputElementAsInput.type(searchQuery);
    await searchInputElementAsInput.press("Enter");

    //On vérifie que la page de recherche à fini de s'afficher
    const mediasElementsSelector = ".content-grid-portrait .text-sm a";
    await page.waitForSelector(mediasElementsSelector, {
      visible: true,
    });

    const mediasTypes = await this.getMediasTypesInSearchResultPage();
    console.log(mediasTypes);

    //On récupère tous les éléments qui contienent le titre de chaque films/series/etc... résultant de la recherche
    const mediasTitles = await page.$$eval(mediasElementsSelector, (elements) =>
      elements.map((el) => el.innerHTML)
    );

    return mediasTitles;
  }

  //TODO
  private async isPageOnSearchResultPage(): Promise<boolean> {
    return true;
  }

  private async getMediasTypesInSearchResultPage(): Promise<MediaType[]> {
    const page = await this.getPageInstance();
    if (!this.isPageOnSearchResultPage()) return [];

    const mediasTypesSelector = "section h2";
    await page.waitForSelector(mediasTypesSelector, {
      visible: true,
    });

    const mediasTypes = await page.$$eval(mediasTypesSelector, (elements) =>
      elements.map((el) => el.innerHTML)
    );

    return mediasTypes as MediaType[];
  }
}
export default new DarkiWorldService();
