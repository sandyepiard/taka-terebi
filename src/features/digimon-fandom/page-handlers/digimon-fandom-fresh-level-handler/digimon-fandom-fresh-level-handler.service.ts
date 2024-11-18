import { ElementHandle, Page } from "puppeteer";
import elementService from "../../../../shared/element/services/element/element.service.js";
import { BaseDigimon } from "../../types/digimon-fandom.types.js";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";

class DigimonFandomFreshLevelHandlerService {
  async getFreshLevelDigimons(): Promise<BaseDigimon[]> {
    const page = await puppeteerService.openWebSite(
      "https://digimon.fandom.com/wiki/Category:Fresh_level"
    );

    const digimonsElementsSelector = "li.category-page__member";
    await page.waitForSelector(digimonsElementsSelector, {
      visible: true,
    });

    const digimonsElementsHandle = await page.$$(digimonsElementsSelector);

    const baseDigimons = await Promise.all(
      digimonsElementsHandle.map(
        async (digimonElementHandle) =>
          await this.getDigimonBaseData(digimonElementHandle)
      )
    );

    return baseDigimons.filter((baseDigimon) => !!baseDigimon);
  }

  private async getDigimonBaseData(
    containerOfDigimon: ElementHandle<Node>
  ): Promise<BaseDigimon | undefined> {
    const imageElementHandle = await containerOfDigimon.$(
      ".category-page__member-left img"
    );
    const imageUrl =
      (imageElementHandle &&
        ((await elementService.getElementHandlePropertyValue(
          "src",
          imageElementHandle
        )) as string)) ||
      undefined;

    const nameAndUrlElementHandle = await containerOfDigimon.$(
      ".category-page__member-link"
    );
    if (!nameAndUrlElementHandle) {
      return;
    }

    const name = (await elementService.getElementHandlePropertyValue(
      "innerHTML",
      nameAndUrlElementHandle
    )) as string;
    const detailsUrl =
      nameAndUrlElementHandle &&
      ((await elementService.getElementHandlePropertyValue(
        "href",
        nameAndUrlElementHandle
      )) as string);

    return {
      name,
      imageUrl,
      detailsUrl,
    };
  }
}
export default new DigimonFandomFreshLevelHandlerService();
