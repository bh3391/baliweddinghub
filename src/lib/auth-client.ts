import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // Pastikan ini ada di .env
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      phone: {
        type: "string",
      },
    },
  },
});

// Trick untuk TypeScript: Beritahu TS bahwa session.user punya role
export type Session = typeof authClient.$Infer.Session;
