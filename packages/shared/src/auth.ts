export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponseDto {
  accessToken: string;
}

export interface UserDto {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}
