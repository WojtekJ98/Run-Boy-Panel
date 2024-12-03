"use client";

import { signOut } from "next-auth/react";

export default function LoginPage() {
  async function logOut() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <button
        onClick={logOut}
        className="mt-4 p-2 bg-green-500 text-white rounded">
        log Out
      </button>
    </>
  );
}
