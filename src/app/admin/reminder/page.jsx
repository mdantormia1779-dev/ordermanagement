"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [reminders, setReminders] = useState([]);

  // ================= FETCH REMINDERS =================
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/reminders`);

        if (!res.ok) {
          throw new Error("Failed to fetch reminders");
        }

        const data = await res.json();
        setReminders(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // ================= DATE FORMAT =================
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const createReminder = async () => {
    if (!orderId || !message) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoadingCreate(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          message,
          createdBy: "Admin", // later from login
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // নতুন reminder UI তে add
      setReminders((prev) => [
        {
          orderId,
          message,
          createdBy: "Admin",
          createdAt: new Date(),
        },
        ...prev,
      ]);

      setOrderId("");
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800"> Reminders</h1>

        <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
          Total: {reminders.length}
        </span>
      </div>

      {/* CREATE CARD */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold mb-4 text-gray-800">➕ Create Reminder</h2>

        <input
          type="text"
          placeholder="Order ID (e.g. ORD-001)"
          className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 mb-3"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />

        <textarea
          placeholder="Reminder message"
          className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 mb-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={createReminder}
          disabled={loadingCreate}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 rounded-lg font-medium"
        >
          {loadingCreate ? "Creating..." : "Create Reminder"}
        </button>
      </div>

      {/* LOADING */}
      {loading && <div className="text-gray-500">Loading reminders...</div>}

      {/* ERROR */}
      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && reminders.length === 0 && (
        <div className="text-gray-500 bg-gray-50 p-6 rounded-xl text-center">
          No reminders found
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {reminders.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            {/* TOP */}
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">
                Order ID:{" "}
                <span className="text-indigo-600">{item.orderId}</span>
              </h2>

              <span className="text-xs text-gray-400">
                {formatDate(item.createdAt)}
              </span>
            </div>

            {/* MESSAGE */}
            <p className="text-gray-600 mt-3 leading-relaxed">{item.message}</p>

            {/* FOOTER */}
            <div className="mt-3 text-sm text-gray-500 flex justify-between">
              <span>👤 {item.createdBy || "Admin"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
