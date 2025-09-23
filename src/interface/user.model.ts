export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  id?: string;
  user: { name?: string; email?: string; password?: string };
}

export interface UpdatePassword {
  id?: string;
  passwords: { currentPassword?: string; newPassword?: string };
}

export interface Email {
  email?: string;
}
