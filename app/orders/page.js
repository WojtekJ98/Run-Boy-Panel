"use client";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import LoadingSpiner from "../../components/LoadingSpiner";
import formatDate from "../lib/formatDate";
import formatMoney from "../lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import Edit from "../../assets/icons/edit.svg";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);
  console.log(orders);

  return (
    <Layout>
      <h1>Created Orders</h1>
      {loading ? (
        <div className="loading">
          <LoadingSpiner />
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-4 ">
            {orders.map((order) => (
              <div
                key={order._id}
                className="shadow-xl p-4 rounded-lg
              ">
                <div className="flex justify-between py-2 flex-wrap">
                  <span>Order ID: {order._id}</span>
                  <span>Created at: {formatDate(order.createdAt)}</span>
                </div>
                <div className="flex gap-4 justify-between items-start max-lg:flex-col">
                  <div>
                    {order.lineItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex border-b-2 p-2 items-center gap-2">
                        <div>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={150}
                            height={100}
                          />
                        </div>
                        <div className="flex flex-col gap-4">
                          <span className="font-bold">{item.name}</span>
                          <div className="flex gap-4">
                            <span>Price: {formatMoney(item.price)}</span>
                            <span>Quantity: {item.quantity}</span>
                            <span>Size: {item.size}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col  gap-4">
                    <span className="font-bold">Deliver Information</span>
                    <div className="flex flex-col gap-2">
                      <span>Country: {order.country}</span>
                      <span>Addres: {order.streetAddress}</span>
                      <span>
                        City:
                        {order.city} {order.postalCode}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 min-w-[200px]">
                    <span className="font-bold">User Details</span>
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
                      <Link
                        className="editLink  place-self-center"
                        href={"/users/user-info/" + order.user}>
                        <Edit /> More Info
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
