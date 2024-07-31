import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "src/schema/task.schema";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: ((configService: ConfigService) => ({
                secret: configService.get<string>("AUTH_SECRET")
            })),
            inject: [ConfigService]
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {}