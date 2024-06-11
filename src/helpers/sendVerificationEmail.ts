import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Anon Message | Email Verification Code",
      react: VerificationEmail({ userName, otp: verifyCode }),
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Email Send Succesfully",
    };
  } catch (emailError) {
    console.log("Error Sending Verification Email", emailError);
    return {
      success: false,
      message: "Error Sending Verification Email",
    };
  }
}
