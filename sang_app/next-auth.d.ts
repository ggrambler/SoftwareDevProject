// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  // If needed, you can also extend the default User type
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
