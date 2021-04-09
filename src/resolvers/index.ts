import ShortUniqueId from 'short-unique-id';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import validUrl from 'valid-url';
import { Url } from '../entity/Url';

import { MyContext } from '../utils/interfaces/context.interface';

@Resolver()
export class MainResolver {
  @Query(() => String)
  async shortenURL(
    @Arg('url') url: string,
    @Ctx() { req }: MyContext
  ): Promise<String> {
    const baseUrl = req.get('host') as string;

    if (!validUrl.isWebUri(baseUrl)) {
      return 'Invalid base url';
    }

    const uid = new ShortUniqueId({
      length: 6,
    });

    const urlCode = uid();

    if (validUrl.isUri(url)) {
      try {
        const response = await Url.findOne({ where: { longUrl: url } });
        if (response) {
          return response?.shortUrl as string;
        } else {
          const shortUrl = `${baseUrl}/${urlCode}`;

          const newUrlEntry = Url.create({
            urlCode,
            longUrl: url,
            shortUrl,
          });

          const response = await Url.save(newUrlEntry);
          return response.shortUrl;
        }
      } catch (error) {
        console.error(error);
        return 'Server error';
      }
    } else {
      return 'Invalid url';
    }
  }
}
