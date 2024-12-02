"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpiner from "../../components/LoadingSpiner";
import Link from "next/link";
import Edit from "../../assets/icons/edit.svg";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/users").then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Layout>
        {loading ? (
          <div className="loading">
            <LoadingSpiner />
          </div>
        ) : (
          <div>
            <div className="flex mt-4 items-center justify-between border-b-2 pb-2 ">
              <span className="text-green-900 text-sm font-semibold ">
                User Name
              </span>
              <span className="text-green-900 text-sm font-semibold mr-10">
                Actions
              </span>
            </div>
            {users.map((user) => (
              <div
                key={user.id}
                className="flex py-1 items-center justify-between border-b-2">
                <h3>{user.name}</h3>
                <div className="flex  items-center justify-center gap-2">
                  <Link
                    className="editLink mr-4"
                    href={"/users/user-info/" + user._id}>
                    <Edit /> More Info
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Layout>
    </>
  );
}
