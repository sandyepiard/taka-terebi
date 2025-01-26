import puppeteerService from "../../../../core/puppeteer/services/puppeteer/puppeteer.service.js";
import elementService from "../../../../shared/element/services/element/element.service.js";

class KhinsiderAlbumHandlerService {
  private readonly siteUrl =
    "https://downloads.khinsider.com/game-soundtracks/album/";

  async getAllDownloadLinksPages(
    albumName: string
  ): Promise<(string | undefined)[]> {
    const { siteUrl } = this;

    const albumPage = await puppeteerService.openWebSite(
      `${siteUrl}${albumName}`
    );
    const songListContainerElement = await albumPage.waitForSelector(
      "table#songlist",
      {
        visible: true,
      }
    );

    if (!songListContainerElement) {
      return [];
    }

    const songsDownloadPagesUrlsHandle = await songListContainerElement.$$(
      "tr td.playlistDownloadSong a"
    );
    const songsDlPagesUrls = await Promise.all(
      songsDownloadPagesUrlsHandle.map(
        async (songDownloadPagesUrlElementHandle) => {
          const songDlPageUrl =
            (songDownloadPagesUrlElementHandle &&
              ((await elementService.getElementHandlePropertyValue(
                "href",
                songDownloadPagesUrlElementHandle
              )) as string)) ||
            undefined;

          return songDlPageUrl;
        }
      )
    );

    albumPage.close();

    return songsDlPagesUrls;
  }
}
export default new KhinsiderAlbumHandlerService();
