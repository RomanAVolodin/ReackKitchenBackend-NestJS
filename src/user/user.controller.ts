import {
  Body,
  Controller,
  Get,
  Post, Put, Req, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import {User} from "@app/user/decorators/user.decorator";
import {UserEntity} from "@app/user/user.entity";
import {AuthGuard} from "@app/user/guards/auth.guard";
import {UpdateUserDto} from "@app/user/dto/updateUser.dto";


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('/current')
  @UseGuards(AuthGuard)
  async currentUser(
      @User() user: UserEntity,
      @User('id') userId: UserEntity,
  ): Promise<UserResponseInterface | null> {
    return this.userService.buildUserResponse(user);
  }

  @Put('/current')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
      @User('id') userId: string,
      @Body('user') dto: UpdateUserDto
  ): Promise<UserResponseInterface | null> {
    const updatedUser = await this.userService.updateUser(userId, dto);
    return this.userService.buildUserResponse(updatedUser);
  }
}
