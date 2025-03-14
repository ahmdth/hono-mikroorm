import { Cascade, Collection, Entity, OneToMany, Property, ManyToOne } from '@mikro-orm/sqlite';

import { Book } from '.';
import { BaseEntity } from './BaseEntity';

type BookEntity = Book;

@Entity()
export class Author extends BaseEntity {
  @Property()
  name: string;

  @Property()
  email: string;

  @Property({ nullable: true })
  age?: number;

  @Property()
  termsAccepted: boolean = false;

  @Property({ nullable: true })
  born?: Date;

  @OneToMany(() => Book, b => b.author, { cascade: [Cascade.ALL] })
  books = new Collection<Book>(this);

  @ManyToOne(() => Book, { nullable: true })
  favouriteBook?: BookEntity;

  constructor(name: string, email: string) {
    super();
    this.name = name;
    this.email = email;
  }
}
