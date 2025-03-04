import { QueryOrder, wrap } from '@mikro-orm/sqlite';
import { Context, Hono } from 'hono';
import { DI } from '../server';
import { paginationValidation, idValidation } from '../utils/validation';
import { bookValidation } from '../utils/bookValidation';

const router = new Hono();

router.get('/', paginationValidation, async (ctx: Context) => {
  let { page = 1, limit = 10 } = ctx.req.valid('query');
  return ctx.json(await DI.books.findAll({
    populate: ['author'],
    orderBy: { title: QueryOrder.DESC },
    limit,
    offset: (page - 1) * limit,
  }), 200);
});

router.get('/:id', idValidation, async (ctx: Context) => {
  try {
    const { id } = ctx.req.valid('param');
    const book = await DI.books.findOne(id, { populate: ['author'] });

    if (!book) {
      return ctx.json({ message: 'Book not found' }, 400);
    }

    return ctx.json(book);
  } catch (e: any) {
    console.error(e);
    return ctx.json(e, 400);
  }
});

router.post('/', bookValidation, async (ctx: Context) => {
  const data = ctx.req.valid('json');
  try {
    const book = DI.books.create(data);
    await DI.em.flush();

    return ctx.json(book);
  } catch (e: any) {
    console.error(e);
    return ctx.json({ message: e.message }, 400);
  }
});

router.put('/:id', idValidation, bookValidation, async (ctx: Context) => {
  try {
    const { id } = ctx.req.valid('param');
    const book = await DI.books.findOne(id);

    if (!book) {
      return ctx.json({ message: 'Book not found' }, 400);
    }

    wrap(book).assign(ctx.req.valid('json'));
    await DI.em.flush();

    return ctx.json(book);
  } catch (e: any) {
    console.error(e);
    return ctx.json({ message: e.message }, 400);
  }
});

router.delete('/:id', idValidation, async (ctx: Context) => {
  try {
    const { id } = ctx.req.valid('param');
    const book = await DI.books.findOne(id);

    if (!book) {
      return ctx.json({ message: 'Book not found' }, 400);
    }
    await DI.em.removeAndFlush(book)
    return ctx.json({ message: "Book deleted succssfully" });
  } catch (e: any) {
    console.error(e);
    return ctx.json({ message: e.message }, 400);
  }
});
export const BookController = router;
