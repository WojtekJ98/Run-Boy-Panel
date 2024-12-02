import client from "../../../lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmail = ["wojtelopl@gmail.com", "runboy@example.com"];
const adminCredentials = {
  email: "runboy@example.com",
  password: "Runboy2024!",
};

const secret = process.env.NEXTAUTH_SECRET;

console.log(secret);

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials.email === adminCredentials.email &&
          credentials.password === adminCredentials.password
        ) {
          return { id: "admin", name: "Admin", email: adminCredentials.email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Point to your custom login page
  },
  // adapter: MongoDBAdapter(client),

  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("JWT callback triggered", { token, user });
      if (user) {
        token.email = user.email;
        token.isAdmin = adminEmail.includes(user.email);
      } else {
        token.isAdmin = adminEmail.includes(token.email);
      }
      console.log("JWT Callback:", { token, user });

      return token;
    },
    session: async ({ session, token }) => {
      console.log("Session callback triggered", { session, token });

      // Safely assign token values to the session
      session.user.email = token.email || session.user.email;
      session.user.isAdmin = token.isAdmin || false;
      console.log("Session Callback:", { session, token });

      return session;
    },
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
