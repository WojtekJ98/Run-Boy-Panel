"use client";
import { useEffect, useState } from "react";
import Layout from "../../../../components/Layout";
import { useParams } from "next/navigation";
import axios from "axios";
import formatDate from "../../../lib/formatDate";
import formatMoney from "../../../lib/formatMoney";
import Image from "next/image";
import LoadingSpiner from "../../../../components/LoadingSpiner";

export default function UserMoreInfo() {
  const [userDetails, setUserDetails] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userCartItems, setUserCartItems] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [userFavoriteItems, setUserFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    if (!slug) {
      return;
    }
    axios.get(`/api/users?id=${slug}`).then((res) => {
      setUserDetails(res.data);
      setLoading(false);
    });
    axios.get(`/api/orders?user=${slug}`).then((res) => {
      setUserOrders(res.data);
      setLoading(false);
    });

    axios.get(`/api/cartitems?user=${slug}`).then((res) => {
      setUserCartItems(res.data);
      setLoading(false);
    });
    axios.get(`/api/favoriteitems?user=${slug}`).then((res) => {
      setUserFavoriteItems(res.data);
      setLoading(false);
    });
    axios.get(`/api/products`).then((res) => {
      setUserProducts(res.data);
      setLoading(false);
    });
  }, [slug]);

  const userCartProducts = userCartItems
    .map((item) => {
      const product = userProducts.find(
        (product) => product._id === item.product
      );
      if (product) {
        return {
          ...product,
          quantity: item.quantity,
          size: item.size,
          addedAt: item.addedAt,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  const userFavoriteProducts = userFavoriteItems
    .map((item) => {
      const product = userProducts.find(
        (product) => product._id === item.product
      );
      if (product) {
        return {
          ...product,

          addedAt: item.addedAt,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
  console.log(userFavoriteProducts);

  return (
    <Layout>
      <h1 className="text-black">
        More info about
        <span className="text-green-900 underline"> {userDetails?.name}</span>
      </h1>
      <div className="flex flex-col gap-1">
        <h2>Information about usser account</h2>
        <div className="flex  items-center gap-4">
          <label>User ID: </label>
          <span>{userDetails?._id}</span>
        </div>
        <div className="flex  items-center gap-4">
          <label>User Name: </label>
          <span>{userDetails?.name}</span>
        </div>
        <div className="flex  items-center gap-4">
          <label>User Email: </label>
          <span>{userDetails?.email}</span>
        </div>
        <div className="flex  items-center gap-4 ">
          <label>User Password: </label>
          <span className="break-all text-wrap">{userDetails?.password}</span>
        </div>
        <div className="flex  items-center gap-4">
          <label>User Create At: </label>
          <span>{formatDate(userDetails?.createdAt)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 ">
        <h2 className="pt-8">User Orders</h2>
        {loading ? (
          <div className="loading">
            <LoadingSpiner />
          </div>
        ) : (
          userOrders.map((order) => (
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
                  <div className="flex  gap-2 font-bold">
                    Order status:
                    {order.paid ? <span> Paid</span> : <span> Unpaid</span>}
                    <div className="text-center">
                      {order.paid ? <span>✔</span> : <span>&times;</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="py-4">
        <h2>User Cart Items</h2>
        <div className="flex flex-col gap-4 ">
          {userCartProducts.map((item) => (
            <div
              key={item._id}
              className="shadow-xl p-4 rounded-lg flex gap-4
            ">
              <div>
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={150}
                  height={100}
                />
              </div>
              <div className="flex flex-col justify-between">
                <h4 className="font-bold">{item.name}</h4>
                <div className="flex gap-4">
                  <span>Size: {item.size}</span>
                  <span>Quantity: {item.quantity}</span>
                </div>
                <span>Added at: {formatDate(item.addedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-4 border-t-2 border-green-900">
        <h2>User Favorite Items</h2>
        <div className="flex flex-col gap-4 ">
          {userFavoriteProducts.map((item) => (
            <div
              key={item._id}
              className="shadow-xl p-4 rounded-lg flex gap-4
            ">
              <div>
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={150}
                  height={100}
                />
              </div>
              <div className="flex flex-col justify-between">
                <h4 className="font-bold">{item.name}</h4>

                <span>Added at: {formatDate(item.addedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
