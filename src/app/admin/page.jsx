"use client";

import React, { useEffect, useState } from "react";
import MyChart from "../Components/Charts/MyChart/MyChart";
import OrderPieChart from "../Components/Charts/OrderPieChart/OrderPieChart";
import RecentOrder from "../Components/Tables/RecentOrder/RecentOrder";
import Reminder from "../Components/Reminder/Reminder";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/orders`);
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  // ================= STATS =================
  const totalOrders = orders.length;

  const pending = orders.filter((o) => o.status === "Pending").length;

  const processing = orders.filter((o) => o.status === "Processing").length;

  const completed = orders.filter((o) => o.status === "Completed").length;

  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

  return (
    <div className="flex min-h-screen bg-gray-100 text-black md:p-8">
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6">
          <h2 className="text-xl text-black md:text-2xl font-semibold">
            Analytics Dashboard
          </h2>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h3 className="text-3xl font-bold text-purple-600">
              {totalOrders}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <h3 className="text-3xl font-bold text-orange-500">{pending}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Processing</p>
            <h3 className="text-3xl font-bold text-blue-500">{processing}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Completed</p>
            <h3 className="text-3xl font-bold text-green-500">{completed}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Cancelled</p>
          <h3 className="text-3xl font-bold text-red-500">{cancelled}</h3>
        </div>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-black mb-4">Analytics Overview</h3>
            <div className="w-full h-50">
              <MyChart />
            </div>
          </div>

          <div className="bg-white text-black p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-black mb-4">Orders by Status</h3>
            <div className="w-full h-50">
              <OrderPieChart />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="grid mt-6 mb-6 grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* LEFT - Recent Orders */}
          <div className="lg:col-span-3 flex">
            <div className="w-full h-full">
              <RecentOrder />
            </div>
          </div>

          {/* RIGHT - Reminder */}
          <div className="lg:col-span-1 flex">
            <div className="w-full h-full">
              <Reminder />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
