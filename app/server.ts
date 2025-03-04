import 'reflect-metadata';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/sqlite';
import { Author, Book } from './entities';
import { Context, Hono } from 'hono';
import { BookController, AuthorController } from './controllers';

export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  authors: EntityRepository<Author>,
  books: EntityRepository<Book>,
};

const app = new Hono();

const port = process.env.PORT || 3000;
(async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.authors = DI.orm.em.getRepository(Author);
  DI.books = DI.orm.em.getRepository(Book);

  app.use((ctx, next) => RequestContext.create(DI.orm.em, next));
  app.get('/', (ctx) => ctx.json({ message: 'Welcome to MikroORM express TS example, try CRUD on /author and /book endpoints!' }));
  app.route('/author', AuthorController);
  app.route('/book', BookController);
  app.all(ctx => ctx.json({ message: 'Not Found' }, 404));
})();

export default {
  port,
  fetch: app.fetch
}
