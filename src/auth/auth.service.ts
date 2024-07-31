import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task } from "src/schema/task.schema";
import { LoginDTO, SignupDTO } from "./dto/auth.dto";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(@InjectModel(Task.name) private authSchema : Model<Task>, private readonly jwtService : JwtService) {}

    async login(loginDto: LoginDTO, response: Response) {
        // this.logger.log("Service login...")
        const findUser = await this.authSchema.findOne().where({email: loginDto.email})
        if (findUser) {
            await this.createJWTToken(response, loginDto.email)
            return {
                status: HttpStatus.OK,
                message: "Logged in successfully"
            }
        }
        throw new HttpException("User not found, create account.", HttpStatus.UNAUTHORIZED)
    }

    async signup(signupData: SignupDTO, response: Response) : Promise<Task> {
        const findUser = await this.authSchema.findOne().where({email: signupData.email})
        if (findUser) {
            this.logger.log(`User found: ${findUser._id}`)
            throw new HttpException("User already exists", HttpStatus.FORBIDDEN)
        }

        await this.createJWTToken(response, signupData.email)
        const encryptedPassword = await argon2.hash(signupData.password);

        const userData = {...signupData, password: encryptedPassword} as SignupDTO
        const user = new this.authSchema(userData);
        return user.save();
    }

    logout(response: Response) {
        this.logger.log("Service logout")
        response.cookie("sessionKey", "", {
            expires: new Date(0)
        })
        return {
            message: "Logout"
        }
    }

    async createJWTToken<T extends string>(response: Response, email: T) {
        const token = await this.jwtService.sign(email)
        const expire = new Date();
        expire.setTime(expire.getTime() + (3 * 60 * 60 * 1000))

        response.cookie("sessionKey", token, {
            httpOnly: true,
            expires: expire
        })

        this.logger.log(`Token created: ${token}`)
    }
}