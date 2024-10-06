import { ElementHandle, Page } from "puppeteer";
import { MediaType } from "../../types/darki-world.types.js";
import elementService from "../../../../shared/element/services/element/element.service.js";

class DarkiWorldMediaTypeService {
  async getMediaTypeNameInMediaTypeElementHandle(
    mediaTypeElementHandle: ElementHandle<HTMLHeadingElement>
  ): Promise<MediaType> {
    const mediasTypesAsStr =
      await elementService.getElementHandleInnerHTMlValue(
        mediaTypeElementHandle
      );

    return mediasTypesAsStr as MediaType;
  }

  async getMediasTypesElementsInSearchResultPage(
    searchPage: Page
  ): Promise<ElementHandle<HTMLHeadingElement>[]> {
    const mediasTypesSelector = "section h2";
    await searchPage.waitForSelector(mediasTypesSelector, {
      visible: true,
    });

    const mediasTypesElementsHandle = await searchPage.$$(mediasTypesSelector);

    return mediasTypesElementsHandle;
  }

  async getMediasTypesInSearchResultPage(
    searchPage: Page
  ): Promise<MediaType[]> {
    const mediasTypesElementsHandle =
      await this.getMediasTypesElementsInSearchResultPage(searchPage);

    const mediasTypesAsStr = await Promise.all(
      mediasTypesElementsHandle.map(
        async (el) => await elementService.getElementHandleInnerHTMlValue(el)
      )
    );

    return mediasTypesAsStr as MediaType[];
  }
}
export default new DarkiWorldMediaTypeService();
