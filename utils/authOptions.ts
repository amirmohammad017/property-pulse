import GitHub from "next-auth/providers/github";
import { signIn } from "next-auth/react";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_AUTH_CLIENT_ID!,
      clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // invoked on successful sign in
    async signIn() {
      // 1 connect to the data base
      // 2 check if user exists.
      // 3 if not create new user
      // 4 return true to allow sign in
      return true;
    },
    async sesssion({ session, user }) {
      // get user from data base
      // assign user id from the session
      // return session
      if (session.user) return session;
    },
  },
};
