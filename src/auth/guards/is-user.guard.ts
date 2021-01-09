import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/models/user.interface';

@Injectable()
export class IsUserGuard implements CanActivate {
  constructor(
    @Inject('UserService')
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;

    return this.userService.findOne(params.id).pipe(
      map((user: User) => {
        let isUser: boolean = false;

        if (!user) {
          throw new UnauthorizedException();
        }

        if (user.id === Number(params.id)) {
          isUser = true;
        }

        return user && isUser;
      }),
    );
  }
}
