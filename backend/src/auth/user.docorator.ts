import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAcessToken } from './interfaces/jwt';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): IAcessToken | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as unknown as { user: IAcessToken }).user;
  },
);

export const CurrentUserID = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as unknown as { user: IAcessToken }).user.id;
  },
);
