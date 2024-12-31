"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from "../components/Layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import formatDate from "./lib/formatDate";
import Link from "next/link";
import LoadingSpiner from "../components/LoadingSpiner";

export default function Home() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/orders", {
        params: { limit: 4 },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      });
    axios
      .get("/api/users", {
        params: { limit: 4 },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="text-green-600 flex  flex-col justify-between">
        <h1>Welcome to Admin Page</h1>
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">
            Hello, {session?.user?.name}
          </h2>
          <div className="h-12 w-12">
            <Image
              src={session?.user?.image}
              width={80}
              height={80}
              alt="Profile Picture"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="py-6">
        <h3 className="text-2xl font-semibold py-2 text-green-900">
          New Orders
        </h3>
        <div className="flex gap-4 flex-wrap ">
          {orders.map((order) => (
            <Link
              className="max-w-[350px] h-full shadow-lg p-4"
              key={order._id}
              href="/orders">
              <div>
                <div className="w-full h-full flex flex-col gap-2">
                  <span className="text-sm">Order ID: {order._id}</span>
                  <span className="text-sm">
                    Created at: {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span>Name: {order.name}</span>
                  <span>Mail: {order.email}</span>
                  <span>
                    Order status:
                    {order.paid ? <span> Paid</span> : <span> Unpaid</span>}
                  </span>
                  <div className="text-center">
                    {order.paid ? <span>✔</span> : <span>&times;</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {loading ? (
        <LoadingSpiner />
      ) : (
        <div>
          <h4 className="text-2xl font-semibold py-2 text-green-900">
            New Users
          </h4>
          <div className="flex gap-4 flex-wrap">
            {orders.map((user) => (
              <Link
                className="max-w-[350px] h-full shadow-lg p-4"
                key={user._id}
                href="/users">
                <div>
                  <div className="w-full h-full flex flex-col gap-2">
                    <span className="text-sm">User ID: {user._id}</span>
                    <span className="text-sm">
                      Created at: {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 py-2">
                    <span>Name: {user.name}</span>
                    <span>Mail: {user.email}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
