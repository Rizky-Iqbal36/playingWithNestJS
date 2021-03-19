import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
// import { User } from './user.interface';
// import { IsEmail, Length } from 'class-validator';
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  //   @IsEmail()
  email: string;

  @Column()
  //   @Length(8, 30)
  password: string;

  @Column()
  name: string;

  @Column()
  userName: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
