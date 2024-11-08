import { ElementHandle, Page } from "puppeteer";
import elementService from "../../../../shared/element/services/element/element.service.js";
import {
  MediaDownloadLink,
  MediaInfos,
} from "../../types/darki-world.types.js";

class DarkiWorldLinkInfosService {
  async getLinkElementInfosAsMediaDownloadLink(
    linkElementHandle: ElementHandle<HTMLTableRowElement>,
    page: Page
  ): Promise<MediaDownloadLink | undefined> {
    const linkElementInfosAsArrayOfString =
      await this.getLinkElementInfosAsArraysOfString(linkElementHandle, page);
    if (!linkElementInfosAsArrayOfString) {
      return;
    }

    const [
      size,
      quality,
      voiceLanguages,
      subtitlesLanguages,
      creationDate,
      downloadLink,
      nfoData,
    ] = linkElementInfosAsArrayOfString;

    const linkInfoAsSingleStringValue = (linkInfoAsArray: string[]) =>
      !!linkInfoAsArray.length ? linkInfoAsArray[0] : "";

    return {
      size: linkInfoAsSingleStringValue(size),
      quality: linkInfoAsSingleStringValue(quality),
      voiceLanguages,
      subtitlesLanguages,
      creationDate: linkInfoAsSingleStringValue(creationDate),
      downloadLink: linkInfoAsSingleStringValue(downloadLink),
      nfo: "", //linkInfoAsSingleStringValue(nfoData), //Trop de donnée à charger
    };
  }

  private async getLinkElementInfosAsArraysOfString(
    linkElementHandle: ElementHandle<HTMLTableRowElement>,
    page: Page
  ): Promise<string[][] | undefined> {
    const linkElementInfo: string[][] = [];

    const sizeElementSelector = `td.fi-table-cell-taille span`;
    const size = await this.getSingleLinkElementInfo(
      sizeElementSelector,
      linkElementHandle
    );
    linkElementInfo.push([size]);

    const qualityElementSelector = `td.fi-table-cell-qualite span.truncate`;
    const quality = await this.getSingleLinkElementInfo(
      qualityElementSelector,
      linkElementHandle
    );
    linkElementInfo.push([quality]);

    const voiceLanguagesElementSelector = `td[class*="fi-table-cell-langues.lang"] span.truncate`;
    const voiceLanguages = await this.getMultipleLinkElementInfo(
      voiceLanguagesElementSelector,
      linkElementHandle
    );
    linkElementInfo.push(voiceLanguages);

    const subtitlesElementSelector = `td[class*="fi-table-cell-subs.sub"] span.truncate`;
    const subtitleLanguages = await this.getMultipleLinkElementInfo(
      subtitlesElementSelector,
      linkElementHandle
    );
    linkElementInfo.push(subtitleLanguages);

    const creationDateElementSelector = `td.fi-table-cell-created-at span`;
    const creationDate = await this.getSingleLinkElementInfo(
      creationDateElementSelector,
      linkElementHandle
    );
    linkElementInfo.push([creationDate]);

    //mock
    const downloadLink = "";
    // const downloadLink = await this.getDownloadLinkData(
    //   linkElementHandle,
    //   page
    // );
    linkElementInfo.push([downloadLink]);

    //mock
    const nfoData = "";
    // const nfoData = await this.getNfoData(linkElementHandle, page);
    linkElementInfo.push([nfoData]);

    return linkElementInfo;
  }

  private async getSingleLinkElementInfo(
    elementSelector: string,
    linkElementHandle: ElementHandle<HTMLTableRowElement>
  ): Promise<string> {
    const elementHandle = await linkElementHandle.$(elementSelector);
    if (!elementHandle) {
      return "";
    }

    const elementValue = (await elementService.getElementHandlePropertyValue(
      "innerHTML",
      elementHandle
    )) as string;

    return elementValue.trim();
  }

  private async getMultipleLinkElementInfo(
    elementsSelector: string,
    linkElementHandle: ElementHandle<HTMLTableRowElement>
  ): Promise<string[]> {
    const elementsHandle = await linkElementHandle.$$(elementsSelector);
    if (!elementsHandle) {
      return [];
    }

    const elementValues = await Promise.all(
      elementsHandle.map(async (elementHandle) => {
        const elementValueAsPromise =
          elementService.getElementHandlePropertyValue(
            "innerHTML",
            elementHandle
          ) as Promise<string>;

        const elementValue = await elementValueAsPromise;

        return elementValue.trim();
      })
    );

    return elementValues;
  }

  private async getDownloadLinkData(
    linkElementHandle: ElementHandle<HTMLTableRowElement>,
    page: Page
  ): Promise<string> {
    const downloadLinkBtnElementSelector = ".fi-link";
    const downloadLinkBtnElementHandle = await linkElementHandle.$(
      downloadLinkBtnElementSelector
    );
    if (!downloadLinkBtnElementHandle) {
      return "";
    }

    downloadLinkBtnElementHandle.click();

    const downloadLinkModalContentElement = await page.waitForSelector(
      "div.fi-modal-content",
      {
        visible: true,
      }
    );
    if (!downloadLinkModalContentElement) {
      return "";
    }

    const downloadLinkUrlElement = await page.waitForSelector(
      '.fi-modal-content a[href*="1fichier.com"]',
      {
        visible: true,
      }
    );
    if (!downloadLinkUrlElement) {
      return "";
    }

    const downloadLinkUrl = (await elementService.getElementHandlePropertyValue(
      "href",
      downloadLinkUrlElement
    )) as string;

    const closeModalBtnElement = await page.waitForSelector(
      '.fi-modal-header button[title*="Fermer"]',
      {
        visible: true,
      }
    );
    if (!closeModalBtnElement) {
      return "";
    }
    closeModalBtnElement.click();

    //TODO: peut etre attendre d'etre sur que la modal est fermé?

    return downloadLinkUrl;
  }

  private async getNfoData(
    linkElementHandle: ElementHandle<HTMLTableRowElement>,
    page: Page
  ): Promise<string> {
    const nfoBtnElementSelector = ".fi-link ~ .fi-link";
    const nfoBtnElementHandle = await linkElementHandle.$(
      nfoBtnElementSelector
    );
    if (!nfoBtnElementHandle) {
      return "";
    }

    nfoBtnElementHandle.click();

    const nfoModalContentElement = await page.waitForSelector(
      "div.fi-modal-content",
      {
        visible: true,
      }
    );
    if (!nfoModalContentElement) {
      return "";
    }

    const nfoValue = (await elementService.getElementHandlePropertyValue(
      "innerHTML",
      nfoModalContentElement
    )) as string;

    const closeModalBtnElement = await page.waitForSelector(
      '.fi-modal-header button[title*="Fermer"]',
      {
        visible: true,
      }
    );
    if (!closeModalBtnElement) {
      return "";
    }
    closeModalBtnElement.click();

    //TODO: peut etre attendre d'etre sur que la modal est fermé?

    return nfoValue;
  }
}
export default new DarkiWorldLinkInfosService();
