"use client";
import { useSession } from "next-auth/react";
import Navigation from "../components/Nav";
import Menu from "../assets/icons/menu.svg";
import RunningShoe from "../assets/icons/running-shoe.svg";
import StoreRun from "../assets/icons/store-runboy.svg";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpiner";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [openNav, setOpenNav] = useState(false);
  useEffect(() => {
    if (status === "authenticated" && !session?.user) {
      router.push("/unauthorized"); // Redirect unauthorized users
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!session) {
    return (
      <div className="w-full h-screen flex flex-col justify-center">
        <h1 className="text-center">You must be log in to use this app.</h1>
        <button
          className="btn-primary place-self-center hover:scale-105 transition-all duration-200"
          onClick={() => router.push("/login")}>
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-900 min-h-screen ">
      <div className="flex justify-between items-center p-2 px-4 md:hidden">
        <Link href="/" className="flex gap-1 items-center min-w-[280px] ">
          <RunningShoe className="" />
          <span className="text-2xl font-bold text-white">Run Boy Admin</span>
          <StoreRun className="" />
        </Link>
        <button onClick={() => setOpenNav(!openNav)}>
          <Menu />
        </button>
        {openNav ? (
          <button
            className="z-20 text-4xl text-white hover:text-red-500 transition-all duration-200"
            onClick={() => setOpenNav(!openNav)}>
            &times;
          </button>
        ) : null}
      </div>
      <div className="flex">
        <Navigation open={openNav} />
        <div className="bg-white overflow-y-scroll h-[98vh] flex-grow mt-2 mr-2 rounded-lg p-4 mb-2">
          {children}
        </div>
      </div>
    </div>
  );
}
