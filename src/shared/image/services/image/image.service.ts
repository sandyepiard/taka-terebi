import axios from "axios";
import { Response } from "express";

class ImageService {
  async getBase64ImagesFromImageUrls(
    imagesUrls: string[],
    res: Response
  ): Promise<string[] | undefined> {
    try {
      const base64ImagesAsPromises = imagesUrls.map(
        async (imageUrl: string) => {
          const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });

          const imageBuffer = Buffer.from(response.data, "binary");
          const base64Image = imageBuffer.toString("base64");
          const imageAsData = `data:${response.headers["content-type"]};base64,${base64Image}`;

          return imageAsData;
        }
      );

      const base64Images = await Promise.all(base64ImagesAsPromises);

      return base64Images;
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching images" });
    }

    return;
  }
}
export default new ImageService();
