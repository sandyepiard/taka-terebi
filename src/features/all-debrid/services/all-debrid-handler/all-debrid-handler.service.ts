import { ElementHandle, Page } from "puppeteer";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import elementService from "../../../../shared/element/services/element/element.service.js";

class AllDebridHandlerService {
  private readonly siteUrl = "https://alldebrid.fr/service";
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

  async leechUrl(url: string): Promise<string | undefined> {
    const page = await this.getPageInstance();

    //Récupération du champ pour parser l'url à débrider
    const linkAreaSelector = "textarea#links";
    const linkAreaElement = await page.locator(linkAreaSelector);

    //On convertit l'input locator en element handle pour pouvoir écrire dans l'input
    const linkAreaElementAsElementHandle = await linkAreaElement.waitHandle();
    await linkAreaElementAsElementHandle.type(url);

    const leechLinkBtnSelector = "#giveMeMyLinks";
    const leechLinkBtnElement = await page.locator(leechLinkBtnSelector);

    const leechLinkBtnElementAsElementHandle =
      await leechLinkBtnElement.waitHandle();
    await leechLinkBtnElementAsElementHandle.click();

    const leechedLinksSuccessResultSelector =
      "#displaylinks .infosLink.successLink";
    const leechedLinksErrorResultSelector =
      "#displaylinks .infosLink.errorLink";
    await page.waitForSelector(leechedLinksErrorResultSelector, {
      visible: true,
    });

    const leechedLinksResultElementHandle = await page.$(
      leechedLinksErrorResultSelector
    );
    if (!leechedLinksResultElementHandle) {
      return;
    }
    console.log(
      await elementService.getElementHandleInnerHTMlValue(
        leechedLinksResultElementHandle
      )
    );

    //TODO
    return "";
  }
}
export default new AllDebridHandlerService();
