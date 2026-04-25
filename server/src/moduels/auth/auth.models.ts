import mongoose, { Schema, type Document } from "mongoose";

export interface Auth extends Document {
  username: string;
  avatar: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isAdmin: boolean;
  isVerified: boolean;
}

const authSchema = new Schema<Auth>(
  {
    username: { type: String, required: true, trim: true },
    avatar:   { type: String },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
    isAdmin:  { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AuthModel = mongoose.model<Auth>("Auth", authSchema);