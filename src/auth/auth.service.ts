import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, UserModel } from '../users/schemas/user.schema';
import { JwtPayload } from '../types';
import { compare, genSalt, hash } from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(UserModel.name)
    private userModel: Model<UserModel>,
  ) {}

  async login(user: AuthDto) {
    const userDocument: UserDocument | null = await this.userModel
      .findOne({
        email: user.email,
      })
      .exec();

    if (!userDocument) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: userDocument.email,
      role: userDocument.role,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return await this.userModel.findOne({ email });
  }

  async register(user: AuthDto): Promise<{ access_token: string }> {
    const salt = await genSalt(10);
    const hashedPassword = await hash(user.password, salt);

    const newUser = new this.userModel({
      email: user.email,
      password: hashedPassword,
      role: Role.USER,
    });

    await newUser.save();

    return await this.login(newUser as UserModel);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error?.message || 'Invalid credentials');
    }
  }
}
