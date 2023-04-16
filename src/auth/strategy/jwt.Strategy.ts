import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/auth/Entity/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'test',
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer ', '');

    const verify = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET || 'test',
    });

    const { nickname, userId } = verify;
    const user: User = await this.userRepository.findOne({
      where: { userId, nickname },
      select: { userId: true, nickname: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
