"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/reminders`);

        const data = await res.json();
        setReminders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-white text-black p-6 rounded-2xl shadow-sm w-full border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Reminders</h2>

        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
          {reminders.length} items
        </span>
      </div>

      {/* LOADING */}
      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      <div className="space-y-3">
        {!loading && reminders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No reminders found
          </p>
        ) : (
          reminders.map((item, index) => (
            <div
              key={index}
              className="group p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition"
            >
              {/* ORDER ID */}
              <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">
                Order ID: {item.orderId}
              </p>

              {/* MESSAGE */}
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {item.message}
              </p>

              {/* FOOTER */}
              <div className="text-xs text-gray-400 mt-3 flex justify-between">
                <span className="flex items-center gap-1">
                  👤 {item.createdBy || "Admin"}
                </span>

                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VIEW ALL */}
      <div className="mt-6 text-right">
        <Link
          href={"/admin/reminder"}
          className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition"
        >
          View All →
        </Link>
      </div>
    </div>
  );
};

export default Reminder;
