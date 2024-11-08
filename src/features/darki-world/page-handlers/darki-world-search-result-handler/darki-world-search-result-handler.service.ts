import { ElementHandle, Page } from "puppeteer";
import { Media, MediasByTypes } from "../../types/darki-world.types.js";
import darkiWorldMediaTypeService from "../../services/darki-world-media-type/darki-world-media-type.service.js";
import elementService from "../../../../shared/element/services/element/element.service.js";

class DarkiWorldSearchResultHandlerService {
  readonly searchInputQueryPathSelector = ".items-center input";
  private readonly mediasTypeContainerElementSelector =
    ".content-grid-portrait";

  async getSearchMediasResult(
    searchQuery: string,
    page: Page
  ): Promise<MediasByTypes> {
    const { searchInputQueryPathSelector } = this;

    //Récupération de l'input de recherche dans la page
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

    const medias = (await this.getMediasInSearchPageResult(page)) ?? [];

    const mediasByTypes = medias.reduce<MediasByTypes>(
      (currMediasByTypes, mediasOfCurrType) => {
        if (!mediasOfCurrType.length) {
          return currMediasByTypes;
        }

        const currType = mediasOfCurrType[0].type;
        if (!currMediasByTypes[currType]) {
          currMediasByTypes[currType] = [];
        }

        currMediasByTypes[currType].push(...mediasOfCurrType);

        return currMediasByTypes;
      },
      {} as MediasByTypes
    );

    return mediasByTypes;
  }

  //TODO
  private async isPageOnSearchResultPage(): Promise<boolean> {
    return true;
  }

  private async getMediasInSearchPageResult(
    page: Page
  ): Promise<Media[][] | undefined> {
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

      const mediaTitlesAndUrl = await this.getTitlesAndUrlOfMediaElement(
        mediaTypeElementHandle
      );
      if (!mediaTitlesAndUrl) {
        return;
      }

      const mediasOfMediaType: Media[] = mediaTitlesAndUrl.map(
        ([title, url]) => ({
          title,
          type: mediaType,
          url,
        })
      );

      medias.push(mediasOfMediaType);
    }

    return medias;
  }

  private async getTitlesAndUrlOfMediaElement(
    mediaTypeElementHandle: ElementHandle<HTMLHeadingElement>
  ): Promise<string[][] | undefined> {
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

    const mediaTitlesAndUrls = await this.getMediasTitlesAndUrl(
      containerOfMediaType
    );

    return mediaTitlesAndUrls;
  }

  /**
   *
   * @param containerOfMediaType
   * @returns [[title: string, url: string]]
   */
  private async getMediasTitlesAndUrl(
    containerOfMediaType: ElementHandle<Node>
  ): Promise<string[][]> {
    const { mediasTypeContainerElementSelector } = this;

    const mediasTitlesElementsSelector = `${mediasTypeContainerElementSelector} .text-sm a`;
    const mediaTitlesElementsHandles = await containerOfMediaType.$$(
      mediasTitlesElementsSelector
    );

    const mediaTitlesAndUrls = await Promise.all(
      mediaTitlesElementsHandles.map(async (mediaTitleElementHandle) => {
        const title = await elementService.getElementHandleInnerHTMlValue(
          mediaTitleElementHandle
        );
        const url = await elementService.getElementHandleHrefValue(
          mediaTitleElementHandle
        );

        return [title, url];
      })
    );

    return mediaTitlesAndUrls;
  }
}
export default new DarkiWorldSearchResultHandlerService();
