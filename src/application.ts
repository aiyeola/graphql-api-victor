import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import ormConfig from '../orm.config';
import Controller from './controller';
import { Url } from './entity/Url';
import { MainResolver } from './resolvers';
import { MyContext } from './utils/interfaces/context.interface';

export default class Application {
  public app!: express.Application;

  public connectDB = async (): Promise<void> => {
    const db = await createConnection({
      ...ormConfig,
      entities: [Url],
    });

    // await db.runMigrations();
  };

  public init = async (): Promise<void> => {
    this.app = express();
    try {
      const schema: GraphQLSchema = await buildSchema({
        resolvers: [MainResolver],
      });

      this.app.use(
        '/graphiql',
        graphqlHTTP(async (req, res) => ({
          schema,
          context: { req, res } as MyContext,
          // should be disabled in production by default but for the use case as a challenge it is enabled in dev and prod environment
          graphiql: true,
        }))
      );

      this.app.use('/:shortUrl', Controller.handleShortUrl);

      const PORT = process.env.PORT || 4000;

      this.app.listen(PORT, () =>
        console.log(`server started on PORT ${PORT}`)
      );
    } catch (error) {
      console.error('📌 Could not start server', error);
    }
  };
}
