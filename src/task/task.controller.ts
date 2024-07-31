import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { TaskGuard } from './guards/task.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TaskService } from './task.service';
import { TaskDto } from 'src/dto/task.dto';

@Controller('task')
@UseGuards(new TaskGuard(new JwtService(), new ConfigService()))
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get("all")
    async allTasks(@Req() request : Request) : Promise<{tasks: TaskDto[]}> {
        const {user} = request.body;
        return this.taskService.getAllTasks(user)
    }

    @Patch("add")
    async addTask(@Req() request: Request) : Promise<{status: number, message: string}> {
        const {user, task} = request.body;
        const createTask = await this.taskService.createTask(user, task)
        return this.taskService.addNewTasks(createTask, user);
    }

    @Patch("delete")
    async removeTask(@Req() request: Request) : Promise<{status: number, message: string}> {
        const {user, name} = request.body;
        return this.taskService.removeTask(user, name)
    }
}
