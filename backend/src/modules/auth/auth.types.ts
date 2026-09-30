export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export type RegisterInput = RegisterUserDto;

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
}
