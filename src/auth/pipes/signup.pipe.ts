import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class SignupValidationPipe implements PipeTransform {
    constructor(private readonly signupSchema: ZodSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const validatedData = this.signupSchema.parse(value)
            return validatedData
        } catch (error) {
            throw new BadRequestException("Validation failed: Invalid data provided")
        }
    }
}