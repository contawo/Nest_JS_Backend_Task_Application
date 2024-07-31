import { TypeOf, z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(5, "Password must be +5 in length")
}).required()

export const SignupSchema = z.object({
    name: z.string(),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(5, "Password must be +5 in length")
})

export type LoginDTO = z.infer<typeof LoginSchema>;
export type SignupDTO = z.infer<typeof SignupSchema>;