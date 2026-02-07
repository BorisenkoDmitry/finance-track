import { Role } from 'src/roles/roles.entity';

export interface IAcessToken {
  id: string;
  name: string;
  surname: string;
  email: string;
  roles: Role[];
}

export type JWTPayload = IAcessToken;
