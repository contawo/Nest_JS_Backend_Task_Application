import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/schema/task.schema';
import { JwtModule } from '@nestjs/jwt';
import { TaskGuard } from './guards/task.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("AUTH_SECRET")
      }),
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>("REDIS_HOST"),
            port: configService.get<number>("REDIS_PORT")
          },
          ttl: 50 * 1000
        })

        return { store, ttl: 50 * 1000 }
      },
      inject: [ConfigService]
    })
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskGuard]
})
export class TaskModule {}
