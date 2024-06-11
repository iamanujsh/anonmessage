import mongoose, { Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: mongoose.Schema<Message> = new mongoose.Schema(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: mongoose.Schema<User> = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "UserName is required"],
    trim: true,
    unique: true,
  },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  verifyCode: { type: String, required: [true, "Verify Code is required"] },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    required: [true, "isVerified is required"],
    default: false,
  },
  isAcceptingMessage: { type: Boolean, required: true, default: true },
  messages: { type: [MessageSchema] },
});

export const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", MessageSchema);
