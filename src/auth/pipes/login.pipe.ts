import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class LoginValidationPipe implements PipeTransform {
    constructor(private readonly loginSchema: ZodSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const validatedData = this.loginSchema.parse(value)
            return validatedData
        } catch(e) {
            throw new BadRequestException("Validation failed: Invalid data")
        } 
    }
}