"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [subAdminId, setSubAdminId] = useState(null);

  // ================= GET SESSION (FIXED) =================
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await authClient.getSession();
        const user = session?.data?.user;

        const id = user?.id || user?._id;

        setSubAdminId(id);
      } catch (err) {
        console.error("Session error:", err);
      }
    };

    fetchSession();
  }, []);

  // ================= FETCH ASSIGNED ORDERS =================
  useEffect(() => {
    if (!subAdminId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/subadmin/orders/${subAdminId}`
        );

        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, [subAdminId]);

  // ================= OPEN MODAL =================
  const openModal = (order) => {
    setSelected(order);
    setStatus(order.status);
    setOpen(true);
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/orders/${selected._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            subAdminId, // 🔥 important for security check
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Update failed");
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === selected._id ? { ...o, status } : o
        )
      );

      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {
    if (status === "Completed")
      return "bg-green-100 text-green-700";
    if (status === "Processing")
      return "bg-blue-100 text-blue-700";
    if (status === "Cancelled")
      return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        My Assigned Orders
      </h1>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={4}>
                  No assigned orders found
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-4">{o._id.slice(-6)}</td>
                  <td>{o.name}</td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => openModal(o)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="font-bold mb-3">
              Update Order Status
            </h2>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 mb-4"
            >
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              {/* <option value="Cancelled">Cancelled</option> */}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                onClick={updateStatus}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;