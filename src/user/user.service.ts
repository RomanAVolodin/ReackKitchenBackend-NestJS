import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { compare } from 'bcrypt';
import {UpdateUserDto} from "@app/user/dto/updateUser.dto";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });
    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or Username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    console.log(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  private generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        jti: uuidv4()
      },
      JWT_SECRET,
    );
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      { email: loginUserDto.email },
      { select: ['id', 'username', 'password', 'email', 'image'] },
    );
    if (!user) {
      throw new HttpException(
          'User doesnt exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordValid = await compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete user.password;
    return user;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne(id);
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, dto);
    return await this.userRepository.save(user)
  }

}
