"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const API = `${process.env.NEXT_PUBLIC_SERVER}/orders`;

  // ================= FETCH REAL DATA =================
  const fetchOrders = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();

        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [API]);

  // ================= OPEN MODAL =================
  const openModal = (order) => {
    setSelected(order);
    setStatus(order.status);
    setOpen(true);
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async () => {
    try {
      const res = await fetch(`${API}/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Status updated");
      setOpen(false);
      fetchOrders(); // refresh real data
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // ================= UI =================
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <span>Total: {orders.length}</span>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Date</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-4">{o._id.slice(-6)}</td>

                <td>{o.name}</td>

                <td>
                  <span className="px-2 py-1 text-xs rounded bg-gray-100">
                    {o.status}
                  </span>
                </td>

                <td>{o.phone}</td>

                <td>{new Date(o.createdAt).toLocaleDateString()}</td>

                <td className="text-right p-4">
                  <button
                    onClick={() => openModal(o)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="font-bold mb-4">Update Status</h2>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 mb-4"
            >
              <option>Pending</option>
              <option>Processing</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>

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
}
