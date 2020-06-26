import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { hash } from 'bcrypt';
import { User } from '../auth/user.entity';
import { Exclude, classToPlain } from 'class-transformer';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  salt: string;

  @ManyToMany((type) => User, (user) => user.orders, { cascade: true })
  @JoinTable()
  payees: User[];

  // TODO: Implement Fee
  // @OneToMany((type) => Fee, (fee) => fee.order, { eager: true })
  // fees: Fee[];

  // TODO: Implement Cart
  // @OneToMany((type) => Cart, (cart) => cart.order, { eager: true })
  // carts: Cart[];

  toJSON(): any {
    return classToPlain(this);
  }

  async validatePassword(password: string): Promise<boolean> {
    const orderHash = await hash(password, this.salt);
    return orderHash === this.password;
  }
}
