"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-600";
    case "processing":
      return "bg-blue-100 text-blue-600";
    case "completed":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RecentOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/orders`
        );

        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl h-full shadow-sm border border-gray-100 w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold">
          Recent Orders
        </h2>
        <Link href={"/admin/order"} className="text-indigo-600 text-sm hover:underline">
          View All
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500 text-sm">Loading orders...</p>
      )}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500 text-sm">
          No orders found.
        </p>
      )}

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-150 w-full text-sm text-left">

          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">
                  {order.name}
                </td>

                <td className="p-3">
                  {order.email}
                </td>

                <td className="p-3">
                  {order.phone}
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default RecentOrder;