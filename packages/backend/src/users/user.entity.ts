export interface UserRow {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPasswordRow extends UserRow {
  passwordHash: string;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  displayName: string;
}
