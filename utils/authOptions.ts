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
      // if (!user) {
      //   User.create({
      //     email: profile.email,
      //     username: profile.username,
      //   });
      // }
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
