"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [trackingData, setTrackingData] = useState([]);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/assignments`
        );
        const data = await res.json();

        const formatted = data.map((item) => ({
          adminName: item.adminName,
          adminId: item.adminId,
          orderId: item.orders
            ? item.orders.map((o) => `#${o.slice(-4)}`).join(", ")
            : "-",
          action: "Assigned Orders",
          status: item.status,
          time: new Date(item.createdAt).toLocaleString(),
        }));

        setTrackingData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTracking();
  }, []);

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "Processing") return "bg-blue-100 text-blue-700";
    if (status === "assigned") return "bg-yellow-100 text-yellow-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const totalActions = trackingData.length;
  const activeAdmins = new Set(trackingData.map((i) => i.adminId)).size;
  const completedOrders = trackingData.filter(
    (i) => i.status === "completed"
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Sub Admin Activity Tracking
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor all assignments & order updates in real time
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Actions</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {totalActions}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Active Admins</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">
            {activeAdmins}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Completed Orders</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {completedOrders}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* table header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-700">
            Activity Logs
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="text-left text-gray-500 bg-gray-100">
              <tr>
                <th className="p-4">Sub Admin</th>
                <th>Order ID</th>
                <th>Action</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {trackingData.length === 0 ? (
                <tr>
                  <td
                    className="p-6 text-center text-gray-500"
                    colSpan={5}
                  >
                    No tracking data found
                  </td>
                </tr>
              ) : (
                trackingData.map((item, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-800">
                        {item.adminName}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {item.adminId?.slice(-6)}
                      </div>
                    </td>

                    <td className="text-indigo-600 font-medium">
                      {item.orderId}
                    </td>

                    <td className="text-gray-600">
                      {item.action}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="text-gray-500 text-sm">
                      {item.time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}