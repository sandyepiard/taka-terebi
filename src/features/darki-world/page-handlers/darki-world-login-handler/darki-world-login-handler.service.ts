import { Page } from "puppeteer";
import darkiWorldSearchResultHandlerService from "../darki-world-search-result-handler/darki-world-search-result-handler.service.js";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import { darkiWorldSiteUrl } from "../../types/darki-world.types.js";

class DarkiWorldLoginHandlerService {
  private readonly loginPageUrl = `${darkiWorldSiteUrl}login`;

  private readonly emailInputElementSelector = 'input[name="email"]';

  /**
   * @deprecated: ne mearche pas correctement
   * @param page
   * @returns
   */
  async isLogged(page: Page): Promise<boolean> {
    if (await this.isOnLoginPage(page)) {
      return false;
    }

    const isLogged = await page.evaluate(() => {
      const loginBtnElementSelector = 'a[href="/login"]';
      const loginBtnElement = document.querySelector(loginBtnElementSelector);
      return !loginBtnElement;
    });

    return isLogged;
  }

  async isOnLoginPage(page: Page): Promise<boolean> {
    const url = page.url();

    const isOnLoginPage = url.includes("login");
    if (!isOnLoginPage) {
      return false;
    }

    await page.waitForSelector(this.emailInputElementSelector, {
      visible: true,
    });

    return true;
  }

  private openLoginPage(): Promise<Page> {
    const { loginPageUrl } = this;

    return puppeteerService.openWebSite(loginPageUrl);
  }

  async login(page: Page): Promise<void> {
    let loginPage = page;
    if (!(await this.isOnLoginPage(page))) {
      loginPage = await this.openLoginPage();
    }
    //TODO: cas où on a pas de page en parametre

    //Saisie de l'email dans le champ
    await loginPage.waitForSelector(this.emailInputElementSelector, {
      visible: true,
    });

    const emailInputElement = await loginPage.locator(
      this.emailInputElementSelector
    );

    const emailInputElementAsInput = await emailInputElement.waitHandle();
    await emailInputElementAsInput.type("tokutatsumoto@gmail.com");

    //Saisie du mdp dans le champ
    const passwordInputElementSelector = 'input[name="password"]';
    const passwordInputElement = await loginPage.locator(
      passwordInputElementSelector
    );

    const passwordInputElementAsInput = await passwordInputElement.waitHandle();
    await passwordInputElementAsInput.type("QVD#KY$$zKwYTbFe^wt2");

    const submitBtnElementSelector = 'button[type="submit"]';
    const submitBtnElement = await loginPage.locator(submitBtnElementSelector);

    const submitBtnElementAsButton = await submitBtnElement.waitHandle();
    await submitBtnElementAsButton.click();

    const { searchInputQueryPathSelector } =
      darkiWorldSearchResultHandlerService;
    //On vérifie que la page à fini de s'afficher
    await loginPage.waitForSelector(searchInputQueryPathSelector, {
      visible: true,
    });

    // loginPage.close();
  }
}
export default new DarkiWorldLoginHandlerService();
