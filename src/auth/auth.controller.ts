import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(
    @Body() loginDto: AuthDto,
  ): Promise<{ data: { access_token: string } }> {
    const data = await this.authService.login(loginDto);
    return { data };
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() authDto: AuthDto): Promise<{ access_token: string }> {
    try {
      const isEmailExists = await this.authService.findByEmail(authDto.email);

      if (isEmailExists) {
        throw new BadRequestException('Email already exists');
      }

      await this.authService.register(authDto);
      return this.authService.login(authDto);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Something went wrong');
    }
  }
}
