import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { IsEmail, Length } from 'class-validator';
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  //   @IsEmail()
  email: string;

  @Column()
  //   @Length(8, 30)
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  userName: string;
}
