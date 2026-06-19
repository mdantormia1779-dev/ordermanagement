"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";

const MyNavbar = () => {
  const { data, loading } = authClient.useSession();
  const user = data?.user;

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const session = await authClient.getSession();
      const user = session?.data?.user;

      const userId = user?.id || user?._id;

      if (userId) {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER}/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
      }

      await authClient.signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/" },
    { name: "Services", href: "/" },
    { name: "Contact", href: "/" },
  ];

  return (
    <>
      <Navbar className="bg-linear-to-br from-purple-50 via-white to-purple-100 shadow-sm border-b border-purple-100 p-2 flex justify-between">
        
        {/* BRAND */}
        <NavbarBrand>
          <p className="font-bold text-2xl tracking-wide text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500">
            YourBrand
          </p>
        </NavbarBrand>

        {/* DESKTOP MENU */}
        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          {navLinks.map((item) => (
            <NavbarItem key={item.name}>
              <Link
                href={item.href}
                className="text-gray-600 font-medium hover:text-purple-700 transition"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}

          {(user?.role === "admin" || user?.role === "user") && (
            <NavbarItem>
              <Link
                href="/admin"
                className="text-gray-600 font-medium hover:text-purple-700 transition"
              >
                Dashboard
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>

        {/* RIGHT SIDE */}
        <NavbarContent justify="end">
          <NavbarItem>
            {loading ? null : user ? (
              <div
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white font-medium cursor-pointer hover:bg-purple-700 transition"
              >
                <span className="font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm">Logout</span>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-linear-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-full shadow-md"
              >
                Login
              </Link>
            )}
          </NavbarItem>

          {/* MOBILE MENU BUTTON */}
          <NavbarItem className="sm:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-2xl text-gray-700"
            >
              ☰
            </button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/40">
          <div className="w-64 h-full bg-white p-5 shadow-lg">
            
            <button
              onClick={() => setOpen(false)}
              className="text-xl mb-5"
            >
              ✕
            </button>

            <div className="flex flex-col gap-4">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-gray-700 font-medium hover:text-purple-700"
                >
                  {item.name}
                </Link>
              ))}

              {(user?.role === "admin" || user?.role === "user") && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-gray-700 font-medium hover:text-purple-700"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyNavbar;