import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.dto';
import { AuthService } from '../../auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(user: User): Observable<User> {
    let body = user;
    return this.findByEmail(user.email).pipe(
      switchMap((user: User) => {
        if (user) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: { message: 'email is already exist' },
            },
            HttpStatus.BAD_REQUEST,
          );
        } else {
          return this.authService.hashPassword(body.password).pipe(
            switchMap((passwordHash: string) => {
              const storeUser = new UserEntity();
              storeUser.email = body.email;
              storeUser.password = passwordHash;
              storeUser.name = body.name;
              storeUser.userName = body.userName;
              return from(this.userRepository.save(storeUser)).pipe(
                switchMap((user: User) => {
                  if (user) {
                    const { password, ...result } = user;
                    body.id = user.id;
                    return this.authService.generateJWT(body).pipe(
                      map((jwt: string) => {
                        throw new HttpException(
                          {
                            status: HttpStatus.OK,
                            data: result,
                            access_token: jwt,
                          },
                          HttpStatus.OK,
                        );
                      }),
                    );
                  } else {
                    throw new HttpException(
                      {
                        status: HttpStatus.BAD_REQUEST,
                        error: { message: 'Server ERROR :(' },
                      },
                      HttpStatus.BAD_REQUEST,
                    );
                  }
                }),
              );
            }),
          );
        }
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (item) {
          delete item.password;
        });
        return users;
      }),
    );
  }

  findOne(id: number): Observable<any> {
    return from(this.userRepository.findOne(id)).pipe(
      map((user: User) => {
        if (!user) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              message: `There is no user with id:${id}`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
        delete user.password;
        return user;
      }),
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.findOne(id)).pipe(
      map((user: User) => {
        if (!user) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              message: `There is no user with id:${id}`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
        return this.userRepository.delete(id);
      }),
    );
    // return from(this.userRepository.delete(id));
  }

  updateOne(id: number, user: User): Observable<any> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        user.password = passwordHash;
        return from(this.userRepository.update(id, user)).pipe(
          switchMap(() => this.findOne(id)),
        );
      }),
    );
    // return from(this.userRepository.update(id, user)).pipe(
    //   switchMap(() => this.findOne(id)),
    // );
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService.generateJWT(user).pipe(
            map((jwt: string) => {
              throw new HttpException(
                {
                  status: HttpStatus.OK,
                  data: { email: user.email, access_token: jwt },
                },
                HttpStatus.OK,
              );
            }),
          );
        } else {
          return 'email or password invalid';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User | Object> {
    return this.findByEmail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Email or password invalid',
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }),
        ),
      ),
    );
  }

  findByEmail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ email }));
  }
}
