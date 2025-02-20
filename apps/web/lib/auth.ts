import { sign } from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import prisma from "@repo/db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        let dbUser;
        dbUser = await prisma.user.findFirst({
          where: { githubId: profile.id.toString() },
        });
    
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              githubId: profile.id.toString(),
              username: profile.login || profile.name,
            },
          });
        }
    
        const newToken = sign({ id: dbUser.id }, process.env.NEXTAUTH_SECRET!, { expiresIn: "1h" });
    
        token.accessToken = newToken;
        token.id = dbUser.id;
      }
    
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.id = token.id;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
