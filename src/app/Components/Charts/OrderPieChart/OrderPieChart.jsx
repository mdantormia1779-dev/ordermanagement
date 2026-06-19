"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#fb923c", "#3b82f6", "#22c55e", "#ef4444"];

const OrderPieChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/orders`
        );

        const orders = await res.json();

        // 🔥 group by status
        const counts = {
          pending: 0,
          processing: 0,
          completed: 0,
          cancelled: 0,
        };

        orders.forEach((order) => {
          const status = (order.status || "pending").toLowerCase();
          if (counts[status] !== undefined) {
            counts[status]++;
          }
        });

        const formatted = [
          { name: "Pending", value: counts.pending },
          { name: "Processing", value: counts.processing },
          { name: "Completed", value: counts.completed },
          { name: "Cancelled", value: counts.cancelled },
        ];

        setChartData(formatted);
      } catch (err) {
        console.error("Chart fetch error:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-6 w-full h-full min-h-62.5">

      {/* CHART */}
      <div className="w-full xl:w-2/3 h-55">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex flex-col w-full xl:w-1/3">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OrderPieChart;