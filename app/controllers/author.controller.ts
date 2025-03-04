import { QueryOrder, wrap } from '@mikro-orm/sqlite';
import { Context, Hono } from 'hono';
import { DI } from '../server';
import { zValidator } from '@hono/zod-validator';
import { idValidation, paginationValidation } from '../utils/validation';
import { authorValidation } from '../utils/authorValidation';
import { Author } from '../entities';

const router = new Hono();

router.get('/', paginationValidation, async (ctx: Context) => {
  let { page = 1, limit = 10 } = ctx.req.valid('query');
  ctx.json(await DI.authors.findAll({
    populate: ['books'],
    orderBy: { name: QueryOrder.DESC },
    limit,
    offset: (page - 1) * limit
  }));
});

router.get('/:id', idValidation, async (ctx: Context) => {
  const { id } = ctx.req.valid('param');
  const author = await DI.authors.findOne(id, { populate: ['books'] });

  if (!author) {
    return ctx.json({ message: 'Author not found' }, 404);
  }

  return ctx.json(author);
});

router.post('/', authorValidation, async (ctx: Context) => {
  let author = ctx.req.valid('json') as Author;
  try {
    author = DI.authors.create(author);
    await DI.em.flush();

    return ctx.json(author);
  } catch (e: any) {
    console.error(e);
    return ctx.json({ message: e.message }, 400);
  }
});

router.put('/:id', idValidation, authorValidation, async (ctx: Context) => {
  try {
    const { id } = ctx.req.valid('param');
    let author = await DI.authors.findOne(id);

    if (!author) {
      return ctx.json({ message: 'Author not found' }, 404);
    }

    author = wrap(author).assign(ctx.req.valid('json'));

    return ctx.json(author);
  } catch (e: any) {
    console.error(e);
    return ctx.json({ message: e.message }, 400);
  }
});

router.delete('/:id', idValidation, async (ctx: Context) => {
  try {
    const { id } = ctx.req.valid('param');
    const author = await DI.authors.findOne(id);

    if (!author) {
      return ctx.json({ message: 'Author not found' }, 400);
    }
    await DI.em.removeAndFlush(author)
    return ctx.json({ message: "Author deleted succssfully" });
  } catch (e: any) {
    console.error(e);
    return ctx.json({ message: e.message }, 400);
  }
});
export const AuthorController = router;
