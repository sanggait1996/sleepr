import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../../../../libs/common/src/decorators/current-user.decorator';
import { UserDocument } from './models/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
