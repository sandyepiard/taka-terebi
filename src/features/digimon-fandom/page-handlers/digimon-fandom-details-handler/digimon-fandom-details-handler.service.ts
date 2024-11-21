import elementService from "../../../../shared/element/services/element/element.service.js";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import { ElementHandle } from "puppeteer";
import {
  BaseDigimon,
  DigimonDetails,
  digimonFandomBaseSiteUrl,
} from "../../types/digimon-fandom.types.js";

class DigimonFandomDetailsHandlerService {
  async getDigimonDetails(
    digimonName: string
  ): Promise<DigimonDetails | undefined> {
    const page = await puppeteerService.openWebSite(
      `${digimonFandomBaseSiteUrl}/${digimonName}`
    );

    const detailsContainerElementSelector = "aside.portable-infobox";
    const detailsContainerElement = await page.waitForSelector(
      detailsContainerElementSelector,
      {
        visible: true,
      }
    );
    if (!detailsContainerElement) {
      return;
    }

    const imageElementHandle = await detailsContainerElement.$("a.image");
    const imageUrl =
      (imageElementHandle &&
        ((await elementService.getElementHandlePropertyValue(
          "href",
          imageElementHandle
        )) as string)) ||
      undefined;

    const levelElementHandle = await detailsContainerElement.$(
      '.pi-item[data-source="level"] div.pi-data-value'
    );
    const level =
      (levelElementHandle &&
        ((await elementService.getElementHandlePropertyValue(
          "innerHTML",
          levelElementHandle
        )) as string)) ||
      "";

    const typeLabelElementHandle = await detailsContainerElement.$(
      'a[href*="Type"]'
    );
    let type: string = "";
    if (typeLabelElementHandle) {
      //TODO: pas bon
      const typeContainerElementHandle =
        await elementService.searchParentElementNodeWithCssSelector(
          ".pi-item",
          typeLabelElementHandle
        );
      if (typeContainerElementHandle) {
        const typeElementHandle = await detailsContainerElement.$(
          "div.pi-data-value"
        );

        type =
          (typeElementHandle &&
            ((await elementService.getElementHandlePropertyValue(
              "innerHTML",
              typeElementHandle
            )) as string)) ||
          "";
      }
    }

    const attributesElementHandle = await detailsContainerElement.$(
      '.pi-item[data-source="attribute"] div.pi-data-value'
    );
    const attributesAsStr =
      (attributesElementHandle &&
        ((await elementService.getElementHandlePropertyValue(
          "innerHTML",
          attributesElementHandle
        )) as string)) ||
      "";
    const attributes = attributesAsStr.split("<br>");

    const familiesElementHandle = await detailsContainerElement.$(
      '.pi-item[data-source="family"] div.pi-data-value'
    );
    const familiesAsStr =
      (familiesElementHandle &&
        ((await elementService.getElementHandlePropertyValue(
          "innerHTML",
          familiesElementHandle
        )) as string)) ||
      "";
    const families = familiesAsStr.split("<br>");

    const sizeElementHandle = await detailsContainerElement.$(
      '.pi-item[data-source="size"] div.pi-data-value'
    );
    const size =
      (sizeElementHandle &&
        ((await elementService.getElementHandlePropertyValue(
          "innerHTML",
          sizeElementHandle
        )) as string)) ||
      "";

    const debutElementHandle = await detailsContainerElement.$(
      '.pi-item[data-source="debut"] div.pi-data-value a'
    );
    const debut =
      (debutElementHandle &&
        ((await elementService.getElementHandlePropertyValue(
          "href",
          debutElementHandle
        )) as string)) ||
      "";

    const priorFormsElementsHandle = await detailsContainerElement.$$(
      '.pi-item[data-source="from"] div.pi-data-value > a'
    );
    const priorForms =
      priorFormsElementsHandle &&
      (await Promise.all(
        priorFormsElementsHandle.map(async (priorFormElementHandle) => {
          const priorForm =
            ((await elementService.getElementHandlePropertyValue(
              "innerHTML",
              priorFormElementHandle
            )) as string) || "";
          return priorForm;
        })
      ));

    const nextFormsElementsHandle = await detailsContainerElement.$$(
      '.pi-item[data-source="to"] div.pi-data-value > a'
    );
    const nextForms =
      nextFormsElementsHandle &&
      (await Promise.all(
        nextFormsElementsHandle.map(async (nextFormElementHandle) => {
          const nextForm =
            ((await elementService.getElementHandlePropertyValue(
              "innerHTML",
              nextFormElementHandle
            )) as string) || "";
          return nextForm;
        })
      ));

    const partnersElementsHandle = await detailsContainerElement.$$(
      '.pi-item[data-source="partner"] div.pi-data-value a'
    );
    const partners =
      partnersElementsHandle &&
      (await Promise.all(
        partnersElementsHandle.map(async (partnersElementHandle) => {
          const partner =
            ((await elementService.getElementHandlePropertyValue(
              "innerHTML",
              partnersElementHandle
            )) as string) || "";
          return partner;
        })
      ));

    const voiceActors: string[] = [];
    const otherNames: string[] = [];
    const variations: string[] = [];

    page.close();

    return {
      name: digimonName,
      imageUrl,
      level,
      type,
      attributes,
      families,
      size,
      debut,
      priorForms,
      nextForms,
      partners,
      voiceActors,
      otherNames,
      variations,
    };
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
export default new DigimonFandomDetailsHandlerService();
