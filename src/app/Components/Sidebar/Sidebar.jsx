// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// const menu = [
//   { name: "Analytics Dashboard", href: "/admin" },
//   { name: "Create Sub Admin", href: "/admin/createsubadmin" },
//   { name: "Orders", href: "/admin/order" },
//   { name: "Assign Orders", href: "/admin/assign" },
//   { name: "Sub Admins", href: "/admin/subadmins" },
//   { name: "Admin Approval", href: "/admin/approval" },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* 🔥 Mobile Top Bar */}
//       <div className="lg:hidden bg-slate-900 text-white p-4">
//         <button onClick={() => setOpen(true)}>
//           ☰
//         </button>
//       </div>

//       {/* 🔥 Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* 🔥 Sidebar */}
//       <aside
//         className={`
//           fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white p-6 flex flex-col
//           transform transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0 lg:static lg:flex
//         `}
//       >
//         {/* Close button (mobile) */}
//         <div className="flex justify-between items-center mb-6 lg:hidden">
//           <h1 className="text-xl font-bold">OrderPanel</h1>
//           <button onClick={() => setOpen(false)}>✕</button>
//         </div>

//         {/* Desktop title */}
//         <h1 className="text-2xl font-bold mb-8 hidden lg:block">
//           OrderPanel
//         </h1>

//         <nav className="space-y-2 flex-1">
//           {menu.map((item) => {
//             let isActive = false;

//             if (item.href === "/admin") {
//               isActive = pathname === "/admin";
//             } else {
//               isActive = pathname.startsWith(item.href);
//             }

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setOpen(false)} // mobile auto close
//                 className={`block px-4 py-2 rounded-lg transition font-medium
//                   ${
//                     isActive
//                       ? "bg-indigo-600 text-white shadow"
//                       : "text-gray-300 hover:bg-slate-800"
//                   }`}
//               >
//                 {item.name}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="pt-6 border-t border-slate-700">
//           <button className="text-red-400 hover:text-red-300 w-full text-left">
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

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
      roles: ["user","admin"],
    }
  ];

  // 🔥 filter by role
  const filteredMenu = menu.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* 🔥 Mobile top bar */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between">
        <h1 className="font-bold">OrderPanel</h1>
        <button onClick={() => setOpen(true)}>☰</button>
      </div>

      {/* 🔥 overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white p-6 flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:flex`}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h1 className="text-xl font-bold">OrderPanel</h1>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <h1 className="text-2xl font-bold mb-8 hidden lg:block">
          OrderPanel
        </h1>

        {/* 🔥 MENU */}
        <nav className="space-y-2 flex-1">
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
                className={`block px-4 py-2 rounded-lg transition font-medium
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-300 hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* logout */}
        <div className="pt-6 border-t border-slate-700">
          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/login";
            }}
            className="text-red-400 hover:text-red-300 w-full text-left"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}