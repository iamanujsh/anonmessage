import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { User } from "@/model/user.model";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { userName, email, password } = await req.json();
    const existingUserVerifiedByUserName = await User.findOne({
      userName,
      isVarified: true,
    });

    if (existingUserVerifiedByUserName) {
      return NextResponse.json(
        {
          success: false,
          message: "User name is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already taken",
        },
        { status: 400 }
      );
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getHours() + 1);

      const newUser = new User({
        userName,
        email,
        password: hashPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    //send verification email
    await sendVerificationEmail(email, userName, verifyCode);

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error Registering User", error);
    return NextResponse.json(
      { error: "Error Registering User" },
      { status: 500 }
    );
  }
};
