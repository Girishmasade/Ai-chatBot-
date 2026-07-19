export type ActiveScreen =
  | "landing"
  | "auth"
  | "dashboard"
  | "chat"
  | "image"
  | "video"
  | "prompt-studio"
  | "models-list"
  | "assets-library"
  | "business-plan"
  | "subscription"
  | "settings"
  | "profile"
  | "admin"
  | "terms"
  | "privacy"
  | "about"
  | "contact";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "User" | "Administrator" | "Developer";
  tier: "free" | "basic" | "pro" | "enterprise";
  credits: number;
  joined: string;
  status: "active" | "suspended";
}

export interface AIAsset {
  id: string;
  type: "chat" | "image" | "video" | "plan";
  title: string;
  prompt: string;
  content: string; // text or image url
  model: string;
  timestamp: string;
}

export interface SystemModel {
  id: string;
  name: string;
  type: string;
  version: string;
  status: "active" | "inactive";
  description: string;
  latency: string;
}

export interface SubscriptionRecord {
  id: string;
  userEmail: string;
  plan: string;
  price: string;
  cycle: string;
  date: string;
  status: string;
}

export interface AuditLog {
  id: string;
  action: string;
  operator: string;
  timestamp: string;
  details: string;
}

export interface CookieConsent {
  id: string;
  user: string;
  consented: boolean;
  categories: string[];
  timestamp: string;
}

export interface BrandingConfig {
  logoName: string;
  logoImage: string;
  themeMode: string;
  primaryColor: string;
  accentGlow: string;
  footerText: string;
}

