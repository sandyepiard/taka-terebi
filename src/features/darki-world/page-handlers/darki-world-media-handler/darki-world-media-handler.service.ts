import { ElementHandle } from "puppeteer";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import elementService from "../../../../shared/element/services/element/element.service.js";
import { Media, MediaInfos } from "../../types/darki-world.types.js";
import darkiWorldLoginHandlerService from "../darki-world-login-handler/darki-world-login-handler.service.js";
import darkiWorldLinkInfosService from "../../services/darki-world-link-infos/darki-world-link-infos.service.js";

class DarkiWorldMediaHandlerService {
  async getPageMediaInfos(media: Media): Promise<MediaInfos | undefined> {
    const { url } = media;

    let mediaPage = await puppeteerService.openWebSite(url);

    // const isLogged = await darkiWorldLoginHandlerService.isLogged(mediaPage);
    // if (!isLogged) {
    await darkiWorldLoginHandlerService.login(mediaPage);
    mediaPage.close();

    mediaPage = await puppeteerService.openWebSite(url);
    // }

    const goToDownloadInfosBtnElementSelector = "a[href*='download']";
    const goToDownloadInfosBtnElement = await mediaPage.waitForSelector(
      goToDownloadInfosBtnElementSelector,
      {
        visible: true,
      }
    );

    if (!goToDownloadInfosBtnElement) {
      return;
    }

    const mediaDownloadPageUrl = await elementService.getElementHandleHrefValue(
      goToDownloadInfosBtnElement
    );
    mediaPage.close();
    const mediaDownloadPage = await puppeteerService.openWebSite(
      mediaDownloadPageUrl
    );

    await mediaDownloadPage.waitForSelector(".items-start", { visible: true });

    const iframeElementSelector = "iframe#iframe-livewire";
    const iframeElementHandle = await mediaDownloadPage.waitForSelector(
      iframeElementSelector
    );
    if (!iframeElementHandle) {
      return;
    }
    const frame = await iframeElementHandle.contentFrame();

    //On affiche les données de l'iframe dans une page (sinon impossible de selectionner un élement)
    const iframeLink = await elementService.getElementHandlePropertyValue(
      "src",
      iframeElementHandle
    );
    const iframeAsPage = await puppeteerService.openWebSite(iframeLink);

    const hostTabLiElementsSelector = "ul li";
    await iframeAsPage.waitForSelector(hostTabLiElementsSelector, {
      visible: true,
    });
    const hostTabLiElementsHandle = await iframeAsPage.$$(
      hostTabLiElementsSelector
    );

    //TODO: prendre en compte le cas où ya pas de lien 1fichier
    let unFichierTabElementHandle: ElementHandle<HTMLLIElement> | undefined;
    for (let i = 0; i < hostTabLiElementsHandle.length; ++i) {
      const hostTabLiElementHandle = hostTabLiElementsHandle[i];
      const id = await elementService.getElementHandlePropertyValue(
        "id",
        hostTabLiElementHandle
      );

      if (id === "1fichier-tab") {
        unFichierTabElementHandle = hostTabLiElementHandle;
        break;
      }
    }
    if (!unFichierTabElementHandle) {
      return;
    }

    //Selection de l'onglet 1fichier
    await unFichierTabElementHandle.click();

    //On attend que les liens soit affiché
    const linksContainerElementSelector = "#h_1fichier table tbody";
    await iframeAsPage.waitForSelector(linksContainerElementSelector, {
      visible: true,
    });

    const linksElementsSelector = `${linksContainerElementSelector} tr:not(:first-child)`;
    const linksElementsHandles = await iframeAsPage.$$(linksElementsSelector);

    const linksElementsInfos = await Promise.all(
      linksElementsHandles.map(async (linkElementHandle) => {
        const linkElementInfos =
          darkiWorldLinkInfosService.getLinkElementInfosAsMediaDownloadLink(
            linkElementHandle,
            iframeAsPage
          );
        return linkElementInfos;
      })
    );
    console.log(linksElementsInfos);

    return {};
  }
}
export default new DarkiWorldMediaHandlerService();
