import { Request, Response } from "express";
import khinsiderSongDownloadHandlerService from "../page-handlers/khinsider-song-download-handler/khinsider-song-download-handler.service.js";
import khinsiderAlbumHandlerService from "../page-handlers/khinsider-album-handler/khinsider-album-handler.service.js";

class KhinsiderController {
  async getAllSongsDownloadLinksOfAlbum(
    req: Request,
    res: Response
  ): Promise<void> {
    const {
      query: { albumName },
    } = req;

    const albumNameAsStr = albumName as string;

    const songsDlPagesLinks =
      await khinsiderAlbumHandlerService.getAllDownloadLinksPages(
        albumNameAsStr
      );

    const songDlLinks = await Promise.all(
      songsDlPagesLinks.map(
        (songDlPageLink) =>
          songDlPageLink &&
          khinsiderSongDownloadHandlerService.getSongDownloadUrl(songDlPageLink)
      )
    );

    // await puppeteerService.closeBrowser();

    res.send(songDlLinks);
  }
}
export default new KhinsiderController();
