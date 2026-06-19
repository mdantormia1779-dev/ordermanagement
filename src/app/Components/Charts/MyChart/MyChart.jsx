"use client";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 🔥 আগে declare (IMPORTANT)
const formatChartData = (orders) => {
  const months = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const month = date.toLocaleString("default", { month: "short" });

    months[month] = (months[month] || 0) + 1;
  });

  return Object.keys(months).map((month) => ({
    name: month,
    value: months[month],
  }));
};

const MyChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/orders`);
        const orders = await res.json();

        const formatted = formatChartData(orders);
        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div
      className="w-full h-full -ml-7.5"
      style={{ width: "105%", height: "100%" }}
    >
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#4f46e5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyChart;