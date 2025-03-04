import { defineConfig } from '@mikro-orm/sqlite';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Author, Book, BookTag, Publisher, BaseEntity } from './entities';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  dbName: 'test.db',
  metadataProvider: TsMorphMetadataProvider,
  entities: [Author, Book, BookTag, Publisher, BaseEntity],
  highlighter: new SqlHighlighter(),
  debug: true,
});

