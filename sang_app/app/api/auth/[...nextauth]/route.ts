import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {config } from "@/components/config";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID ??"",
      clientSecret: config.GOOGLE_CLIENT_SECRET?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub; // Store user ID
      }
      console.log("Session Data Sent to Client:", session);
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      console.log("Token Data:", token);
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debugging
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
