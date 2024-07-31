import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService : JwtService, private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request : Request = context.switchToHttp().getRequest();

        const token = request.cookies["sessionKey"]
        try {
            const payload = this.jwtService.verify(token, {secret: this.configService.get<string>("AUTH_SECRET")})
            const requestEmail = request.body.email;
    
            if (payload && requestEmail === payload) return true;
            throw new HttpException({status: HttpStatus.UNAUTHORIZED, message: "You are not an authorized user"}, HttpStatus.UNAUTHORIZED);

        } catch(e) {
            throw new HttpException({status: HttpStatus.UNAUTHORIZED, message: "You are not an authorized user"}, HttpStatus.UNAUTHORIZED);
        }
    }
}