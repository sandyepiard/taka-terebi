import { Page } from "puppeteer";
import darkiWorldSearchResultHandlerService from "../darki-world-search-result-handler/darki-world-search-result-handler.service.js";

class DarkiWorldLoginHandlerService {
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

  async login(page: Page): Promise<void> {
    if (!this.isOnLoginPage(page)) {
      //TODO: do something
    }
    //TODO: cas où on a pas de page en parametre

    this.isLogged(page);

    //Saisie de l'email dans le champ
    const emailInputElementSelector = 'input[name="email"]';
    const emailInputElement = await page.locator(emailInputElementSelector);

    const emailInputElementAsInput = await emailInputElement.waitHandle();
    await emailInputElementAsInput.type("tokutatsumoto@gmail.com");

    //Saisie du mdp dans le champ
    const passwordInputElementSelector = 'input[name="password"]';
    const passwordInputElement = await page.locator(
      passwordInputElementSelector
    );

    const passwordInputElementAsInput = await passwordInputElement.waitHandle();
    await passwordInputElementAsInput.type("QVD#KY$$zKwYTbFe^wt2");

    const submitBtnElementSelector = 'button[type="submit"]';
    const submitBtnElement = await page.locator(submitBtnElementSelector);

    const submitBtnElementAsButton = await submitBtnElement.waitHandle();
    await submitBtnElementAsButton.click();

    const { searchInputQueryPathSelector } =
      darkiWorldSearchResultHandlerService;
    //On vérifie que la page à fini de s'afficher
    await page.waitForSelector(searchInputQueryPathSelector, {
      visible: true,
    });

    this.isLogged(page);
  }
}
export default new DarkiWorldLoginHandlerService();
