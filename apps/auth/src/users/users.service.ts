import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return await this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Email already exists.');
  }

  async findAll() {
    return await this.userRepository.find({});
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(`Credential are not valid`);
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException(`Credential are not valid`);
    }

    return user;
  }

  async remove(_id: string) {
    return await this.userRepository.findOneAndDelete({ _id });
  }

  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto);
  }
}
