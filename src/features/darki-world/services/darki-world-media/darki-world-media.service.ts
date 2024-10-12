import { Media } from "../../types/darki-world.types.js";

class DarkiWorldMediaService {
  mapMediasToMediaTitle(medias: Media[]): string[] {
    const mediasTitles = medias.map((media) => media.title);

    return mediasTitles;
  }
}
export default new DarkiWorldMediaService();
