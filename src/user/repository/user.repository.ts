// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { from, Observable } from 'rxjs';
// import { UserEntity } from '../models/user.entity';
// import { User } from '../models/user.interface';

// @Injectable()
// export class UserRepository {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepository: Repository<UserEntity>,
//   ) {}

//   read(): Observable<User[]> {
//     return from(this.userRepository.find());
//   }
// }
