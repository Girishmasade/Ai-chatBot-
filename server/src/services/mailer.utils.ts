// src/utils/mailer.ts

import nodemailer from "nodemailer";
import { SMTP_EMAIL, SMTP_PASSWORD } from "../env/env.import.js";

// ── Transporter ────────────────────────────────────────────

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

// ── Types ──────────────────────────────────────────────────

type EmailType = "otp" | "welcome" | "passwordChanged" | "notification";

interface BaseEmailOptions {
  to: string;
  type: EmailType;
}

interface OTPEmailOptions extends BaseEmailOptions {
  type: "otp";
  payload: { otp: string; username: string };
}

interface WelcomeEmailOptions extends BaseEmailOptions {
  type: "welcome";
  payload: { username: string };
}

interface PasswordChangedEmailOptions extends BaseEmailOptions {
  type: "passwordChanged";
  payload: { username: string };
}

interface NotificationEmailOptions extends BaseEmailOptions {
  type: "notification";
  payload: { username: string; title: string; body: string };
}

type EmailOptions =
  | OTPEmailOptions
  | WelcomeEmailOptions
  | PasswordChangedEmailOptions
  | NotificationEmailOptions;

// ── Templates ──────────────────────────────────────────────

const baseLayout = (content: string): string => `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 520px;
    margin: auto;
    border: 1px solid #e4e4e4;
    border-radius: 10px;
    overflow: hidden;
  ">
    <div style="background: #4F46E5; padding: 20px 30px;">
      <h1 style="color: white; margin: 0; font-size: 22px;">AI ChatBot</h1>
    </div>
    <div style="padding: 30px;">
      ${content}
    </div>
    <div style="background: #f9f9f9; padding: 16px 30px; text-align: center;">
      <p style="color: #aaa; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} AI ChatBot. All rights reserved.
      </p>
    </div>
  </div>
`;

const templates: Record<
  EmailType,
  (payload: EmailOptions["payload"]) => { subject: string; html: string }
> = {
  otp: (payload) => {
    const { otp, username } = payload as OTPEmailOptions["payload"];
    return {
      subject: "Verify your email - OTP",
      html: baseLayout(`
        <h2 style="color: #333;">Hello, ${username} 👋</h2>
        <p style="color: #555;">
          Use the OTP below to verify your account.
          It expires in <strong>10 minutes</strong>.
        </p>
        <div style="
          font-size: 38px;
          font-weight: bold;
          letter-spacing: 10px;
          text-align: center;
          padding: 20px;
          background: #f4f4f4;
          border-radius: 8px;
          margin: 24px 0;
          color: #4F46E5;
        ">
          ${otp}
        </div>
        <p style="color: #888; font-size: 13px;">
          If you didn't request this, please ignore this email.
        </p>
      `),
    };
  },

  welcome: (payload) => {
    const { username } = payload as WelcomeEmailOptions["payload"];
    return {
      subject: "Welcome to AI ChatBot 🎉",
      html: baseLayout(`
        <h2 style="color: #333;">Welcome aboard, ${username}! 🚀</h2>
        <p style="color: #555;">
          We're excited to have you. Your account has been successfully created.
        </p>
        <p style="color: #555;">
          Start exploring the AI ChatBot and experience the future of conversation.
        </p>
        <a href="${process.env.CLIENT_URL}" style="
          display: inline-block;
          margin-top: 20px;
          padding: 12px 28px;
          background: #4F46E5;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
        ">
          Get Started
        </a>
      `),
    };
  },

  passwordChanged: (payload) => {
    const { username } = payload as PasswordChangedEmailOptions["payload"];
    return {
      subject: "Your password was changed",
      html: baseLayout(`
        <h2 style="color: #333;">Hi, ${username}</h2>
        <p style="color: #555;">
          Your password has been changed successfully.
        </p>
        <p style="color: #e53e3e; font-weight: bold;">
          If you did not make this change, please contact support immediately.
        </p>
        <a href="${process.env.CLIENT_URL}/contact" style="
          display: inline-block;
          margin-top: 20px;
          padding: 12px 28px;
          background: #e53e3e;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
        ">
          Contact Support
        </a>
      `),
    };
  },

  notification: (payload) => {
    const { username, title, body } =
      payload as NotificationEmailOptions["payload"];
    return {
      subject: title,
      html: baseLayout(`
        <h2 style="color: #333;">Hi, ${username}</h2>
        <h3 style="color: #4F46E5;">${title}</h3>
        <p style="color: #555;">${body}</p>
      `),
    };
  },
};

// ── Main sendEmail ─────────────────────────────────────────

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { subject, html } = templates[options.type](options.payload);

  await transporter.sendMail({
    from: `"AI ChatBot" <${process.env.SMTP_EMAIL}>`,
    to: options.to,
    subject,
    html,
  });
}