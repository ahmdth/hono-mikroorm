import { QueryOrder, wrap } from '@mikro-orm/sqlite';
import { Context, Hono } from 'hono';
import { DI } from '../server';
import { z } from 'zod';
import { Book } from '../entities';

const router = new Hono();

router.get('/', async (ctx: Context) => {
  return ctx.json(await DI.books.findAll({
    populate: ['author'],
    orderBy: { title: QueryOrder.DESC },
    limit: 20,
  }), 200);
});

router.get('/:id', async (ctx: Context) => {
  try {
    const id = z.coerce.number().parse(ctx.req.param('id'));
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

router.post('/', async (ctx: Context) => {
  const { title, authorId } = await ctx.req.json()
  const book = z.object({
    title: z.string(),
    authorId: z.number(),
    publisherId: z.optional(z.number()),
    metaObject: z.optional(z.object({ value: z.any() })),
    metaArray: z.optional(z.array(z.any())),
    metaArrayOfStrings: z.optional(z.string())
  })
  const data = book.safeParse(await ctx.req.json())

  try {
    const book = DI.books.create(data.data);
    await DI.em.flush();

    return ctx.json(book);
  } catch (e: any) {
    console.error(e);
    return ctx.json({ message: e.message }, 400);
  }
});

router.put('/:id', async (ctx: Context) => {
  try {
    const params = z.object({ id: z.number() }).parse(ctx.req.param());
    const book = await DI.books.findOne(params.id);

    if (!book) {
      return ctx.json({ message: 'Book not found' }, 400);
    }

    wrap(book).assign(await ctx.req.json());
    await DI.em.flush();

    return ctx.json(book);
  } catch (e: any) {
    console.error(e);
    return ctx.json({ message: e.message }, 400);
  }
});

export const BookController = router;
