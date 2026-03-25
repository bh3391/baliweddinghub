import { auth } from "./lib/auth";

type Session = typeof auth.$Infer.Session;
type User = typeof auth.$Infer.Session.user;

declare module "better-auth" {
  interface User extends User {
    role: string;
    phone?: string;
  }
}
