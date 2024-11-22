import { Request, Response } from "express";
import imageService from "../../services/image/image.service.js";

class ImageController {
  async getBase64ImagesFromImageUrls(
    request: Request,
    response: Response
  ): Promise<void> {
    const imagesUrls = request.body.imagesUrls;

    const base64Images = await imageService.getBase64ImagesFromImageUrls(
      imagesUrls,
      response
    );

    response.send(base64Images);
  }
}
export default new ImageController();
