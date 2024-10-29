import { Page } from "puppeteer";
import darkiWorldSearchResultHandlerService from "../darki-world-search-result-handler/darki-world-search-result-handler.service.js";
import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import { darkiWorldSiteUrl } from "../../types/darki-world.types.js";

class DarkiWorldLoginHandlerService {
  private readonly loginPageUrl = `${darkiWorldSiteUrl}login`;

  async isLogged(page: Page): Promise<boolean> {
    if (this.isOnLoginPage(page)) {
      return false;
    }

    const isLogged = await page.evaluate(() => {
      const loginBtnElementSelector = 'a[href="/login"]';
      const loginBtnElement = document.querySelector(loginBtnElementSelector);
      return !loginBtnElement;
    });

    console.log(isLogged);

    return isLogged;
  }

  isOnLoginPage(page: Page): boolean {
    const url = page.url();

    return url.includes("login");
  }

  private openLoginPage(): Promise<Page> {
    const { loginPageUrl } = this;

    return puppeteerService.openWebSite(loginPageUrl);
  }

  async login(page: Page): Promise<void> {
    let loginPage = page;
    if (!this.isOnLoginPage(page)) {
      loginPage = await this.openLoginPage();
    }
    //TODO: cas où on a pas de page en parametre

    //Saisie de l'email dans le champ
    const emailInputElementSelector = 'input[name="email"]';
    const emailInputElement = await loginPage.locator(
      emailInputElementSelector
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
  }
}
export default new DarkiWorldLoginHandlerService();
