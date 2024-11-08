import { ElementHandle } from "puppeteer";

class ElementService {
  /**
   * @deprecated
   * @param elementHandle
   * @returns
   */
  async getElementHandleInnerHTMlValue(
    elementHandle: ElementHandle<any>
  ): Promise<string> {
    const innerHTMLAsJSHandle = await elementHandle.getProperty("innerHTML");

    const innerHTMLAsJSHandleAsStr = await innerHTMLAsJSHandle.jsonValue();
    return innerHTMLAsJSHandleAsStr;
  }

  /**
   * @deprecated
   * @param elementHandle
   * @returns
   */
  async getElementHandleHrefValue(
    elementHandle: ElementHandle<any>
  ): Promise<string> {
    const hrefAsJSHandle = await elementHandle.getProperty("href");

    const hrefAsJSHandleAsStr = await hrefAsJSHandle.jsonValue();
    return hrefAsJSHandleAsStr;
  }

  async getElementHandlePropertyValue(
    propertyName: string,
    elementHandle: ElementHandle<any>
  ): Promise<any> {
    const propertyAsJSHandle = await elementHandle.getProperty(propertyName);

    const propertyAsJSHandleValue = await propertyAsJSHandle.jsonValue();
    return propertyAsJSHandleValue;
  }

  async searchParentElementNodeWithCssSelector(
    cssSelector: string,
    element: ElementHandle<Node>
  ): Promise<ElementHandle<Node> | undefined> {
    const parentElementAsHandle = await element.getProperty("parentElement");
    const parentElement = parentElementAsHandle.asElement();

    if (parentElement === null) {
      return;
    }

    const isParentMatchingCssSelector = !!(await parentElement.$(cssSelector));
    if (isParentMatchingCssSelector) {
      return parentElement;
    }

    return this.searchParentElementNodeWithCssSelector(
      cssSelector,
      parentElement
    );
  }
}
export default new ElementService();
