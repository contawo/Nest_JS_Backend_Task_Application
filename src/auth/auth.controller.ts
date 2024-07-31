import { Body, Controller, Logger, Post, Res, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { AuthGuard } from "./guards/auth.guard";
import { LoginDTO, LoginSchema, SignupDTO, SignupSchema } from "./dto/auth.dto";
import { LoginValidationPipe } from "./pipes/login.pipe";
import { SignupValidationPipe } from "./pipes/signup.pipe";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    private readonly logger = new Logger(AuthController.name)

    @Post("login")
    @UsePipes(new LoginValidationPipe(LoginSchema))
    login(@Body() loginDto : LoginDTO, @Res({passthrough: true}) response: Response) {
        // this.logger.log(loginDto)
        return this.authService.login(loginDto, response)
    }

    @Post("logout")
    @UseGuards(new AuthGuard(new JwtService(), new ConfigService))
    logout(@Res({passthrough: true}) response: Response) {
        return this.authService.logout(response)
    }

    @Post("signup")
    @UseInterceptors(new AuthInterceptor())
    @UsePipes(new SignupValidationPipe(SignupSchema))
    signup(@Body() signupDto : SignupDTO, @Res({passthrough: true}) response: Response) {
        return this.authService.signup(signupDto, response)
    }
}