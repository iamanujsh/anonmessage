import z from "zod";

export const userNameValidation = z
  .string()
  .min(2, "User name must be atleast 2 characters")
  .max(20, "User name must be less than 20 characters");

export const SignUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 character" }),
});
