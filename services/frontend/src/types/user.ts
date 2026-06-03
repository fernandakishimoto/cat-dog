export type UserRoleType = 'admin' | 'adotante';

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
};
