import puppeteer, { Browser, ElementHandle, Locator, Page } from "puppeteer";

class Puppeteer {
  private browser?: Browser;
  private debugMode = false;

  async getBrowserInstance(): Promise<Browser> {
    if (this.browser) return this.browser;

    const { debugMode } = this;

    const browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: !debugMode,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process,SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
      ],
      ignoreDefaultArgs: ["--disable-extensions"],
      timeout: 0,
      slowMo: debugMode ? 1 : undefined,
    });
    this.browser = browser;

    return browser;
  }

  async openWebSite(urlOfSiteToOpen: string): Promise<Page> {
    // Launch the browser and open a new blank page
    const browser = await this.getBrowserInstance();

    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto(urlOfSiteToOpen);

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    return page;
  }

  async closeBrowser(): Promise<void> {
    const browser = await this.getBrowserInstance();
    browser.close();
  }
}
export default new Puppeteer();
