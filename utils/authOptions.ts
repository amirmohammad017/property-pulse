import connectDb from "@/config/database";
import User from "@/models/User";
import GitHub, { GithubProfile } from "next-auth/providers/github";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_AUTH_CLIENT_ID!,
      clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  callbacks: {
    // invoked on successful sign in
    async signIn({ profile }: { profile: GithubProfile }) {
      if (!profile) return false;
      // 1 connect to the data base
      await connectDb();
      // 2 check if user exists.
      console.log(profile);
      const user = await User.findOne({ email: profile.email });

      // 3 if not create new user
      if (!user) {
        try {
          await User.create({
            email: profile.email,
            username: profile.login,
            image: profile.avatar_url,
          });
        } catch (error) {
          console.log(error);
        }
      }
      // 4 return true to allow sign in
      return true;
    },
    async session({ session }) {
      // get user from data base
      console.log(session);
      const user = await User.findOne({ email: session.user.email });
      if (!user) return;
      // assign user id from the session

      // return session
      if (session.user) return session;
    },
  },
};
