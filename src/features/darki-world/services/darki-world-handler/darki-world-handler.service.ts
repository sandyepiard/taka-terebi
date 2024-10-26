import { ElementHandle, Page } from "puppeteer";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import { Media } from "../../types/darki-world.types.js";
import darkiWorldMediaTypeService from "../darki-world-media-type/darki-world-media-type.service.js";
import elementService from "../../../../shared/element/services/element/element.service.js";
import darkiWorldMediaService from "../darki-world-media/darki-world-media.service.js";

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

    const medias = (await this.getMediasInSearchPageResult()) ?? [];
    console.log(medias);

    const flatMedias = medias.flatMap((mediasByMediaType) => mediasByMediaType);

    const mediasTitles =
      darkiWorldMediaService.mapMediasToMediaTitle(flatMedias);
    return mediasTitles ?? [];
  }

  //TODO
  private async isPageOnSearchResultPage(): Promise<boolean> {
    return true;
  }

  private async getMediasInSearchPageResult(): Promise<Media[][] | undefined> {
    const page = await this.getPageInstance();
    if (!this.isPageOnSearchResultPage()) {
      return;
    }

    const mediasTypesElementsHandles =
      await darkiWorldMediaTypeService.getMediasTypesElementsInSearchResultPage(
        page
      );

    let mediaTypesElementsHandle: ElementHandle<HTMLHeadingElement>[] = [];
    for (let i = 0; i < mediasTypesElementsHandles.length; ++i) {
      const el = mediasTypesElementsHandles[i];

      mediaTypesElementsHandle.push(el);
    }
    if (!mediaTypesElementsHandle.length) {
      return;
    }

    let medias: Media[][] = [];
    for (let i = 0; i < mediasTypesElementsHandles.length; ++i) {
      const mediaTypeElementHandle = mediasTypesElementsHandles[i];

      const mediaType =
        await darkiWorldMediaTypeService.getMediaTypeNameInMediaTypeElementHandle(
          mediaTypeElementHandle
        );

      const mediaTitles = await this.getTitlesOfMediaElement(
        mediaTypeElementHandle
      );
      if (!mediaTitles) {
        return;
      }

      const mediasOfMediaType: Media[] = mediaTitles.map((mediaTitle) => ({
        title: mediaTitle,
        type: mediaType,
      }));

      medias.push(mediasOfMediaType);
    }

    return medias;
  }

  async getTitlesOfMediaElement(
    mediaTypeElementHandle: ElementHandle<HTMLHeadingElement>
  ): Promise<string[] | undefined> {
    const mediaTypeElementHandleNode = mediaTypeElementHandle.asElement();
    if (!mediaTypeElementHandleNode) {
      return;
    }

    const sectionElementOfMediaTypeElement =
      await elementService.searchParentElementNodeWithCssSelector(
        "section.mb-20",
        mediaTypeElementHandleNode
      );

    if (!sectionElementOfMediaTypeElement) {
      return;
    }

    const containerOfMediaType = sectionElementOfMediaTypeElement;
    // const containerOfFilmAsHandle =
    //   await sectionElementOfFilmMediaTypeElement.getProperty("parentElement");
    // const containerOfFilm = containerOfFilmAsHandle.asElement();
    // if (!containerOfFilm) {
    //   return;
    // }

    const mediasElementsSelector = ".content-grid-portrait .text-sm a";
    const mediaTitlesElementsHandles = await containerOfMediaType.$$(
      mediasElementsSelector
    );

    const mediaTitles = await Promise.all(
      mediaTitlesElementsHandles.map(
        async (mediaTitleElementHandle) =>
          await elementService.getElementHandleInnerHTMlValue(
            mediaTitleElementHandle
          )
      )
    );

    return mediaTitles;
  }
}
export default new DarkiWorldHandlerService();
