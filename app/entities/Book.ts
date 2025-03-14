import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/sqlite';
import { Author, BookTag, Publisher } from './index';
import { BaseEntity } from './BaseEntity';

type PublisherEntity = Publisher;

@Entity()
export class Book extends BaseEntity {
  @Property()
  title: string;

  @ManyToOne(() => Author)
  author: Author;

  @ManyToOne(() => Publisher, { cascade: [Cascade.PERSIST, Cascade.REMOVE], nullable: true })
  publisher?: PublisherEntity;

  @ManyToMany(() => BookTag)
  tags = new Collection<BookTag>(this);

  @Property({ nullable: true })
  metaObject?: object;

  @Property({ nullable: true })
  metaArray?: any[];

  @Property({ nullable: true })
  metaArrayOfStrings?: string[];

  constructor(title: string, author: Author) {
    super();
    this.title = title;
    this.author = author;
  }
}
