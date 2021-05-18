import { Request, Response } from 'express';
import { Url } from '../entity/Url';

export default class Controller {
  static async handleShortUrl(req: Request, res: Response): Promise<void> {
    const shortUrl = req.params.shortUrl;

    if (shortUrl.length !== 6) {
      res.send('url is invalid');
    }
    try {
      const response = await Url.findOneOrFail({
        where: { urlCode: shortUrl },
      });
      res.redirect(response.longUrl);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        res.send("url doesn't exist");
      }
    }
  }
}
