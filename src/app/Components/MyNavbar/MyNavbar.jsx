"use client";

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
  // ✅ logout
  const handleLogout = async () => {
  try {
    const session = await authClient.getSession();
    const user = session?.data?.user;

    const userId = user?.id || user?._id;

    // 🔥 backend call
    if (userId) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      console.log("logout api response:", data);
    }

    await authClient.signOut();

    window.location.href = "/auth/login";
  } catch (err) {
    console.error("Logout error:", err);
  }
};
  return (
    <Navbar className="bg-linear-to-br from-purple-50 via-white to-purple-100 shadow-sm border-b border-purple-100 p-2 flex justify-between">
      {/* Brand */}
      <NavbarBrand>
        <p className="font-bold text-2xl tracking-wide text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500">
          YourBrand
        </p>
      </NavbarBrand>

      {/* Center Links */}
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem>
          <Link
            href="/"
            className="text-gray-600 font-medium hover:text-purple-700 transition"
          >
            Home
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link
            href="/"
            className="text-gray-600 font-medium hover:text-purple-700 transition"
          >
            About
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link
            href="/"
            className="text-gray-600 font-medium hover:text-purple-700 transition"
          >
            Services
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link
            href="/"
            className="text-gray-600 font-medium hover:text-purple-700 transition"
          >
            Contact
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link
            href="/admin"
            className="text-gray-600 font-medium hover:text-purple-700 transition"
          >
            dashboard
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Side */}
      {/* Right Side */}
      <NavbarContent justify="end">
        <NavbarItem>
          {loading ? null : user ? (
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white font-medium cursor-pointer hover:bg-purple-700 transition"
            >
              {/* 🔥 FIRST LETTER */}
              <span className="font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </span>

              {/* 🔥 TEXT */}
              <span className="text-sm">Logout</span>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-linear-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-full shadow-md"
            >
              Login
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default MyNavbar;
