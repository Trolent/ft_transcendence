export type SafeUser = {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  language: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
