import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { TaskDto } from 'src/dto/task.dto';
import { Task } from 'src/schema/task.schema';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskSchema : Model<Task>,
        @Inject("CACHE_MANAGER") private readonly cacheManger : Cache
    ) {}

    async getAllTasks(email: string) : Promise<{tasks: TaskDto[]}> {
        const cachedData = await this.cacheManger.get(`${email}_tasks`)
        if (cachedData) {
            console.log("Data fetched from cache")
            return {tasks: cachedData as TaskDto[]}
        };

        const user = await this.taskSchema.findOne().where({email});
        if (!user) throw new NotFoundException("User not found");

        await this.cacheManger.set(`${email}_tasks`, user.tasks, 0)

        return {tasks: user.tasks};
    }

    async addNewTasks(task: TaskDto, email: string) : Promise<{status: number, message: string}> {
        const user = await this.taskSchema.findOneAndUpdate(
            {email},
            {$addToSet: {tasks: task}},
            {new: true}
        )
        if (!user) throw new HttpException({status: HttpStatus.NOT_ACCEPTABLE, message: "Failed to create task"}, HttpStatus.NOT_ACCEPTABLE);

        await this.cacheManger.del(`${email}_tasks`)

        return {
            status: HttpStatus.CREATED,
            message: "Task created successfully"
        }
    }

    async createTask(email: string, task: string): Promise<TaskDto> {
        const user = await this.taskSchema.findOne().where({email});
        if (!user) throw new NotFoundException("Task not found");

        return {
            name: task,
            author: user.email,
            created: new Date()
        }
    }

    async removeTask(email: string, taskName: string) : Promise<{status: number, message: string}> {
        const deletedTask = await this.taskSchema.findOneAndUpdate(
            {email},
            {$pull: {tasks: {name: taskName}}}
        )
        if (!deletedTask) throw new NotFoundException("Task not found");

        return {
            status: HttpStatus.ACCEPTED,
            message: `${taskName} deleted successfully.`
        }
    }
}
