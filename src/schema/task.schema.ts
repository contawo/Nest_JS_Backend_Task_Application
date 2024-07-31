import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TaskDto } from "src/dto/task.dto";

@Schema()
export class Task {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    password: string

    @Prop({ required: true })
    tasks: TaskDto[]
}

export const TaskSchema = SchemaFactory.createForClass(Task); 