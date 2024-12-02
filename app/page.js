"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from "../components/Layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      console.log("Session:", session); // This should trigger the session callback
    }
  }, [status, session]);
  return (
    <Layout>
      <div className="text-green-600 flex  flex-col stify-between">
        <h1>Welcome to Admin Page</h1>
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">
            Hello, {session?.user?.name}
          </h2>
          <div className="h-12 w-12">
            <img
              src={session?.user?.image}
              alt="Profile Picture"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
