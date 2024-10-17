import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ENV } from 'src/config/environment';
import { CacheUser, JWTPayload } from 'src/dto/common-request.dto';
import { User } from 'src/entities/user/user.entity';
import { App404Exception } from 'src/middleware/app-error-handler';
import { ExtractUtil } from 'src/utils/extract';
import { GenerateUtil } from 'src/utils/generate';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheStore) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: ENV.JWT.JWT_SECRET,
    } as StrategyOptions);
  }

  async validate(payload: JWTPayload) {
    const cacheKeyAuth = GenerateUtil.keyAuth(payload);
    let cacheUser: CacheUser = await this.cacheManager.get(cacheKeyAuth);

    if (!cacheUser) {
      const user = await User.findOne({
        where: { id: payload.sub },
        relations: {
          role: {
            rolePermissions: {
              permission: true,
            },
          },
        },
      });

      if (!user) {
        throw new App404Exception('sub', payload);
      }

      const actions = await ExtractUtil.roleActions(user.role);

      cacheUser = {
        userId: user.id,
        username: user.username,
        roleId: user.roleId,
        roleCode: user.role.code,
        isSupperAdmin: user.isSupperAdmin,
        actions,
      };
      await this.cacheManager.set(cacheKeyAuth, cacheUser, { ttl: 86400 });
    }

    return cacheUser;
  }
}
