import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import BadRequest from '../errors/BadRequest';
import IAuthService from '../interfaces/IAuthService';
import IUser from '../interfaces/IUser';
import Unauthorized from '../errors/Unauthorized';

export default class AuthController {
  protected service: IAuthService;
  constructor(service: IAuthService) {
    this.service = service;
  }

  public async login(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    try {
      const { email, password } = req.body as IUser;
      if (!email || !password) {
        throw new BadRequest('Email or password is required');
      }
      const payload = { email, password };
      const token = await this.service.generateToken(payload);
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  public async validate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { authorization } = req.headers;
    try {
      if (authorization) {
        const isTokenValid = this.service.authToken(authorization as string);
        const { role } = isTokenValid as JwtPayload;
        return res.status(200).json({ role });
      }
      if (!authorization) {
        throw new Unauthorized('Token not found');
      }
    } catch (error) {
      next(error);
    }
  }
}
