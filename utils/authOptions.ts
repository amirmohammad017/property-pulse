import connectDb from "@/config/database";
import User from "@/models/User";
import GitHub from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_AUTH_CLIENT_ID!,
      clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // invoked on successful sign in
    async signIn({ profile }) {
      // 1 connect to the data base
      await connectDb();
      // 2 check if user exists.
      console.log(profile);
      const user = await User.findOne({ email: profile.email });

      // 3 if not create new user
      if (!user) {
        try {
          await User.create({
            email: profile.login,
            username: profile.email,
            image: profile.avatar_url,
          });
        } catch (error) {
          console.log(error);
        }
      }
      // 4 return true to allow sign in
      return true;
    },
    async sesssion({ session }) {
      // get user from data base
      const user = await User.findOne({ email: session.email });
      if (!user) return;
      // assign user id from the session
      
      // return session
      if (session.user) return session;
    },
  },
};
