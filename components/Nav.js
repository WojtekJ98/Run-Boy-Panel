import Link from "next/link";
import RunningShoe from "../assets/icons/running-shoe.svg";
import Home from "../assets/icons/home.svg";
import StoreRun from "../assets/icons/store-runboy.svg";
import ShoeProducts from "../assets/icons/shoes-products.svg";
import Setting from "../assets/icons/settings.svg";
import Order from "../assets/icons/order.svg";
import List from "../assets/icons/list.svg";
import Users from "../assets/icons/users.svg";
import LogOut from "../assets/icons/log-out.svg";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
export default function Navigation({ open }) {
  const inActiveLink = "flex items-center gap-1 p-1";
  const activeLink = `${inActiveLink}  bg-green-600 rounded-l-lg  `;
  const pathname = usePathname();
  async function logOut() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <aside
      className={`
        ${open ? "left-0" : "-left-full"} +
        text-white p-4  pr-0 text-lg fixed w-full bg-green-900 h-full md:static md:w-auto top-0 transition-all`}>
      <Link
        href="/"
        className="flex gap-1 items-center mb-6 mr-4 min-w-[280px] ">
        <RunningShoe className="" />
        <span className="text-2xl font-bold px-2 ">Run Boy Admin</span>
        <StoreRun className="" />
      </Link>
      <nav className="flex flex-col gap-2 text-xl font-semibold">
        <Link
          href={"/"}
          className={pathname === "/" ? activeLink : inActiveLink}>
          <Home /> Dashboard
        </Link>
        <Link
          href={"/products"}
          className={
            pathname.includes("/products") ? activeLink : inActiveLink
          }>
          <ShoeProducts /> Products
        </Link>
        <Link
          href={"/categories"}
          className={
            pathname.includes("/categories") ? activeLink : inActiveLink
          }>
          <List /> Categories
        </Link>
        <Link
          href={"/orders"}
          className={pathname.includes("/orders") ? activeLink : inActiveLink}>
          <Order />
          Orders
        </Link>
        <Link
          href={"/users"}
          className={pathname.includes("/users") ? activeLink : inActiveLink}>
          <Users />
          Users
        </Link>
        <button onClick={logOut} className={inActiveLink}>
          <LogOut />
          LogOut
        </button>
      </nav>
    </aside>
  );
}
