import client from "../../../lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmail = ["wojtelopl@gmail.com"];
const testUserCredentials = {
  email: "runboy@example.com",
  password: "Runboy2024!",
};

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
          credentials.email === testUserCredentials.email &&
          credentials.password === testUserCredentials.password
        ) {
          return {
            id: "123",
            name: "Run Boy",
            email: testUserCredentials.email,
            role: "user",
          };
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
      if (user) {
        if (adminEmail.includes(user.email)) {
          token.role = "admin";
        } else {
          token.role = user.role || "user";
        }
        token.email = user.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      // Safely assign token values to the session
      session.user.email = token.email || session.user.email;
      session.user.role = token.role || "user";
      session.user.isAdmin = token.role === "admin";

      return session;
    },
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
export const OPTIONS = authOptions;
