"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AssignOrders = () => {
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/orders`);
      const data = await res.json();

      const formatted = data.map((o) => ({
        id: o._id,
        orderId: `#ORD-${o._id.slice(-4)}`,
        customer: o.name,
        status: o.status,
        date: new Date(o.createdAt).toLocaleDateString(),
        checked: true,
      }));

      setOrders(formatted);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/users`);
      const data = await res.json();

      setAdmins(data);
      if (data.length > 0) setSelectedAdmin(data[0]);
    };

    fetchAdmins();
  }, []);

  const toggleCheckbox = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, checked: !o.checked } : o
      )
    );
  };

  const handleAssign = async () => {
    const selectedOrders = orders
      .filter((o) => o.checked)
      .map((o) => o.id);

    if (!selectedAdmin || selectedOrders.length === 0) {
      toast.success("Select admin and orders");
      return;
    }

    const payload = {
      adminId: selectedAdmin._id,
      adminName: selectedAdmin.name,
      orders: selectedOrders,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/assign-orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    toast.success(data.message || "Assigned successfully");
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white text-black rounded-2xl shadow-lg">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Assign Orders
        </h2>
        <span className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Select</th>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`border-t hover:bg-gray-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={order.checked}
                    onChange={() => toggleCheckbox(order.id)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                </td>

                <td className="p-3 font-medium text-indigo-600">
                  {order.orderId}
                </td>

                <td className="p-3 text-gray-700">
                  {order.customer}
                </td>

                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    {order.status}
                  </span>
                </td>

                <td className="p-3 text-gray-500">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADMIN SELECT + BUTTON */}
      <div className="mt-6 flex flex-col md:flex-row gap-4 items-end">
        
        <div className="w-full md:flex-1">
          <label className="text-sm text-gray-600 mb-2 block">
            Select Sub Admin
          </label>

          <select
            value={selectedAdmin?._id || ""}
            onChange={(e) => {
              const admin = admins.find(
                (a) => a._id === e.target.value
              );
              setSelectedAdmin(admin);
            }}
            className="w-full border text-black rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-lg shadow-md w-full md:w-auto"
        >
          Assign Orders
        </button>
      </div>
    </div>
  );
};

export default AssignOrders;