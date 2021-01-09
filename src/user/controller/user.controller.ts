import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { IsUserGuard } from '../../auth/guards/is-user.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';
import { UserValidationPipe } from '../pipes/user-validation.pipe';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  create(@Body(UserValidationPipe) user: User): Observable<Object> {
    return this.userService.create(user);
  }

  @Post('login')
  login(@Body(UserValidationPipe) user: User): Observable<Object> {
    return this.userService.login(user);
  }
  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number): Observable<User> {
    return this.userService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard, IsUserGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() user: User): Observable<Object> {
    return this.userService.updateOne(id, user);
  }
}
