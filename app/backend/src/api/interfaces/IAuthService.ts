import { JwtPayload } from 'jsonwebtoken';
import IUser from './IUser';

export default interface IAuthService {
  generateToken(dto: IUser): Promise<string>;
  authToken(Authorization: string): JwtPayload | string
}
