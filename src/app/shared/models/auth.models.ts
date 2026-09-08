export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  user_type: string;
  role: {
    "id": string,
    "name": string
  },
  email: string;
  permissions: string[]
  // avatarUrl?: string;
}

export interface AuthResponse {
  user: AuthUser;
  // accessToken: string;
  // refreshToken: string;
  // expiresIn: number; // seconds
}

export interface EmailAvailabilityResponse {
  available: boolean;
}