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
    async signIn({ profile }) {
      if (!profile) return false;
      const gh = profile as GithubProfile;

      await connectDb();

      const user = await User.findOne({ email: gh.email });

      if (!user) {
        try {
          await User.create({
            email: gh.email,
            username: gh.login,
            image: gh.avatar_url,
          });
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true;
    },

    async session({ session }) {
      if (!session.user) return session;

      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
      }
      return session;
    },
  },
};
