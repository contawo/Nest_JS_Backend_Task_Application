import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class TaskGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request : Request = context.switchToHttp().getRequest()
        const token = request.cookies["sessionKey"]

        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>("AUTH_SECRET")
            })
            if (!payload) throw new UnauthorizedException("You are not authorized");
            request.body = {user: payload, ...request.body}
            return true
        } catch (error) {
            throw new ForbiddenException("You are forbidden to access this endpoint")
        }
    }
}