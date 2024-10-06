import { ElementHandle, Page } from "puppeteer";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import { Media, MediaType } from "../../types/darki-world.types.js";
import darkiWorldMediaTypeService from "../darki-world-media-type/darki-world-media-type.service.js";
import elementService from "../../../../shared/element/services/element/element.service.js";

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

    const films = await this.getFilmsInSearchPageResult();

    return films ?? [];
  }

  //TODO
  private async isPageOnSearchResultPage(): Promise<boolean> {
    return true;
  }

  private async getFilmsInSearchPageResult(): Promise<string[] | undefined> {
    const page = await this.getPageInstance();
    if (!this.isPageOnSearchResultPage()) {
      return;
    }

    const mediasTypesElementsHandles =
      await darkiWorldMediaTypeService.getMediasTypesElementsInSearchResultPage(
        page
      );

    // const filmMediaTypeElementHandle = mediasTypesElementsHandles.find(
    //   async (el) => {
    //     const mediaType =
    //       await darkiWorldMediaTypeService.getMediaTypeNameInMediaTypeElementHandle(
    //         el
    //       );
    //     console.log(mediaType);
    //     return mediaType === "Film";
    //   }
    // )
    let filmMediaTypeElementHandle;
    for (
      let i = 0;
      i < mediasTypesElementsHandles.length || !filmMediaTypeElementHandle;
      ++i
    ) {
      const el = mediasTypesElementsHandles[i];
      const mediaType =
        await darkiWorldMediaTypeService.getMediaTypeNameInMediaTypeElementHandle(
          el
        );
      if (mediaType === "Film") {
        filmMediaTypeElementHandle = el;
      }
    }
    if (!filmMediaTypeElementHandle) {
      return;
    }

    const filmMediaTypeElementHandleNode =
      filmMediaTypeElementHandle.asElement();
    if (!filmMediaTypeElementHandleNode) {
      return;
    }

    const sectionElementOfFilmMediaTypeElement =
      await elementService.searchParentElementNodeWithCssSelector(
        "section.mb-20",
        filmMediaTypeElementHandleNode
      );

    if (!sectionElementOfFilmMediaTypeElement) {
      return;
    }

    const containerOfFilm = sectionElementOfFilmMediaTypeElement;
    // const containerOfFilmAsHandle =
    //   await sectionElementOfFilmMediaTypeElement.getProperty("parentElement");
    // const containerOfFilm = containerOfFilmAsHandle.asElement();
    // if (!containerOfFilm) {
    //   return;
    // }

    const mediasElementsSelector = ".content-grid-portrait .text-sm a";
    const filmTitlesElementsHandles = await containerOfFilm.$$(
      mediasElementsSelector
    );

    const filmTitles = await Promise.all(
      filmTitlesElementsHandles.map(
        async (filmTitleElementHandle) =>
          await elementService.getElementHandleInnerHTMlValue(
            filmTitleElementHandle
          )
      )
    );

    return filmTitles;
  }
}
export default new DarkiWorldService();
