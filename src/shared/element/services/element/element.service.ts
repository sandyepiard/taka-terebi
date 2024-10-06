import { ElementHandle } from "puppeteer";

class ElementService {
  async getElementHandleInnerHTMlValue(
    elementHandle: ElementHandle<any>
  ): Promise<string> {
    const innerHTMLAsJSHandle = await elementHandle.getProperty("innerHTML");

    const innerHTMLAsJSHandleAsStr = await innerHTMLAsJSHandle.jsonValue();
    return innerHTMLAsJSHandleAsStr;
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
