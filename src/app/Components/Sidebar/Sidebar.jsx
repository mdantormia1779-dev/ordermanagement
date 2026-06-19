"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // 🔥 get session user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
    };
    loadUser();
  }, []);

  // 🔥 role-based menu
  const menu = [
    {
      name: "Analytics Dashboard",
      href: "/admin",
      roles: ["admin", "user"],
    },
    {
      name: "Create Sub Admin",
      href: "/admin/createsubadmin",
      roles: ["admin"],
    },
    {
      name: "Orders",
      href: "/admin/order",
      roles: ["admin"],
    },
    {
      name: "Assign Orders",
      href: "/admin/assign",
      roles: ["admin"],
    },
    {
      name: "Sub Admins",
      href: "/admin/subadmins",
      roles: ["admin"],
    },
    {
      name: "Admin Approval",
      href: "/admin/approval",
      roles: ["admin"],
    },
    {
      name: "Admin Assiged Orders",
      href: "/admin/assignedsubadmin",
      roles: ["user"],
    },
    {
      name: "Reminder",
      href: "/admin/reminder",
      roles: ["user", "admin"],
    },
  ];

  // 🔥 filter by role
  const filteredMenu = menu.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      {/* 🔥 MOBILE TOP BAR */}
      <div className="lg:hidden bg-slate-900 text-white p-4">
        <button onClick={() => setOpen(true)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* 🔥 OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 h-full
          bg-slate-900 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-lg font-bold">Admin Panel</h2>

          <button className="lg:hidden text-xl" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {filteredMenu.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  block px-4 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-300 hover:bg-slate-800"
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/login";
            }}
            className="w-full text-left text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
