import elementService from "../../../../shared/element/services/element/element.service.js";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import { ElementHandle } from "puppeteer";
import {
  BaseDigimon,
  digimonFandomBaseSiteUrl,
} from "../../types/digimon-fandom.types.js";

class DigimonFandomLevelHandlerService {
  async getLevels(): Promise<string[]> {
    const page = await puppeteerService.openWebSite(
      `${digimonFandomBaseSiteUrl}/Category:Species_by_level`
    );

    const levelsElementsSelector = "a.category-page__member-link";
    await page.waitForSelector(levelsElementsSelector, {
      visible: true,
    });

    const levelsElementsHandle = await page.$$(levelsElementsSelector);

    const levels = await Promise.all(
      levelsElementsHandle.map(async (levelElementHandle) => {
        const nameInHref = (await elementService.getElementHandlePropertyValue(
          "href",
          levelElementHandle
        )) as string;

        const splitedNameInHref = nameInHref.split("Category:");

        return splitedNameInHref[splitedNameInHref.length - 1];
      })
    );

    page.close();

    return levels;
  }

  async getBaseDigimonsByLevel(level: string): Promise<BaseDigimon[]> {
    const page = await puppeteerService.openWebSite(
      `https://digimon.fandom.com/wiki/Category:${level}`
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

    page.close();

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
export default new DigimonFandomLevelHandlerService();
