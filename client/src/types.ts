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
  | "contact"
  | "socials";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "User" | "Administrator" | "Developer" | "admin" | "user";
  tier: "free" | "basic" | "pro" | "enterprise" | "paid";
  isPaid?: boolean;
  activePlanId?: string;
  planName?: string;
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
  appName: string;
  logoName: string;
  logoImage: string;
  mainLogo: string;
  favicon: string;
  mobileLogo: string;
  themeMode: string;
  primaryColor: string;
  accentGlow: string;
  footerText: string;
  phone?: string;
  email?: string;
  description?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

// ─── Backend API Response Types ──────────────────────────────────────────────

/** Standard backend response wrapper from successHandler / errorHandler */
export interface ApiResponse<T = Record<string, unknown>> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

/** Auth user shape from the backend (matches Auth Mongoose document) */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  isVerified: boolean;
}

/** Returned by verifyOtp on success */
export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

/** Token wallet from backend */
export interface TokenWallet {
  _id: string;
  user: string;
  balance: number;
  frozen: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Token transaction from backend */
export interface TokenTransaction {
  _id: string;
  user: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  reference?: string;
  createdAt: string;
}

/** Subscription plan (admin-created) from backend */
export interface SubscriptionPlan {
  _id: string;
  name: string;
  plan: string;
  price: number;
  currency?: string;
  description: string;
  tokens?: number;
  durationInDays?: number;
  services: string[];
  isActive: boolean;
  rolloverEnabled?: boolean;
  rolloverCapPercent?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** User subscription record from backend */
export interface UserSubscription {
  _id: string;
  user: string;
  plan: string;
  status: "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string | null;
  activatedAt: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Token package (purchasable credit bundles, e.g. Starter Pack) */
export interface TokenPackage {
  _id: string;
  id?: string;
  name: string;
  tokens?: number;
  tokenAmount: number;
  price: number;
  currency?: string;
  status?: "active" | "inactive" | string;
  isActive?: boolean;
  isPopular?: boolean;
  sortOrder?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Active subscription response for current user */
export interface MySubscriptionResponse {
  hasActiveSubscription: boolean;
  isPaid: boolean;
  tier: "free" | "paid" | "basic" | "pro" | "enterprise";
  plan: SubscriptionPlan | null;
  subscription: UserSubscription | null;
}

export interface PolicyImage {
  url: string;
  publicId?: string;
  caption?: string;
}

export interface PrivacySection {
  _id?: string;
  title: string;
  content: string;
  order: number;
  icon?: string;
  image?: PolicyImage;
}

export interface ThirdPartyProcessor {
  name: string;
  purpose: string;
  privacyPolicyUrl?: string;
}

export interface PrivacyPolicy {
  _id: string;
  title: string;
  slug: string;
  version: string;
  summary: string;
  content?: string;
  status: "draft" | "published" | "archived";
  isCurrent: boolean;
  effectiveDate: string;
  lastUpdated: string;
  bannerImage?: PolicyImage;
  sections: PrivacySection[];
  thirdPartyProcessors?: ThirdPartyProcessor[];
  userRights?: string[];
  securityMeasures?: string[];
  contactEmail: string;
  retentionPeriod?: string;
  cookiePolicySummary?: string;
  changelog?: string;
  createdBy?: any;
  updatedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface TermsSection {
  _id?: string;
  title: string;
  content: string;
  order: number;
  icon?: string;
  image?: PolicyImage;
}

export interface TermsAndCondition {
  _id: string;
  title: string;
  slug: string;
  version: string;
  summary: string;
  content?: string;
  status: "draft" | "published" | "archived";
  isCurrent: boolean;
  effectiveDate: string;
  lastUpdated: string;
  bannerImage?: PolicyImage;
  sections: TermsSection[];
  keyHighlights?: string[];
  prohibitedActivities?: string[];
  governingLaw?: string;
  contactEmail: string;
  changelog?: string;
  createdBy?: any;
  updatedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

