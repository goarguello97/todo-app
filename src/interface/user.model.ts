export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  email?: string;
  user: { name?: string; email?: string; password?: string };
}

export interface UpdatePassword {
  email?: string;
  passwords: { currentPassword?: string; newPassword?: string };
}

export interface Email {
  email?: string;
}
