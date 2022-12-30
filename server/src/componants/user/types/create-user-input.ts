export enum Role {
  user = "user",
  admin = "admin",
}
export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role: Role[];
}

