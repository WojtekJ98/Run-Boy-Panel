import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmail = ["wojtelopl@gmail.com", "runboy@example.com"];
const adminCredentials = {
  email: "runboy@example.com",
  password: "Runboy2024!",
};

export const authOptions = {
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
