export interface JwtPayload {
  userId: string;
  role: string;
  email: string;
  username: string;
  isVerified: boolean;
}

export interface AuthUser {
  id: string;
  role: string;
  email: string;
  username: string;
  googleId?: string;
  githubId?: string;
  facebookId?: string;
  isVerified: boolean;
}