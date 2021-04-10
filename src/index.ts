import 'reflect-metadata';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { MainResolver } from './resolvers';
import { Url } from './entity/Url';
import ormConfig from '../orm.config';
import { MyContext } from './utils/interfaces/context.interface';

const main = async (): Promise<void> => {
  const app: express.Application = express();

  try {
    const db = await createConnection({
      ...ormConfig,
      entities: [Url],
    });

    // await db.runMigrations();

    const schema: GraphQLSchema = await buildSchema({
      resolvers: [MainResolver],
    });

    app.use(
      '/graphiql',
      express.json(),
      graphqlHTTP((req, res) => ({
        schema,
        context: { req, res } as MyContext,
        customFormatErrorFn: (error) => {
          throw error;
        },
        graphiql: true,
      }))
    );

    app.listen(process.env.PORT, () =>
      console.log(`server started on PORT ${process.env.PORT}`)
    );
  } catch (error) {
    console.error('📌 Could not start server', error);
  }
};

main();
