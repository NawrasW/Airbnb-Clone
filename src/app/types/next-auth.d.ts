import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string | null;
    password?: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    sub: string;
  }
}
