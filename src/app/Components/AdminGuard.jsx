"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await authClient.getSession();
      const user = data?.user;

      // ❌ not logged in
      if (!user) {
        router.push("/login");
        return;
      }

      // ✅ admin allowed
      if (user.role === "admin") {
        setLoading(false);
        return;
      }

      // ✅ subadmin allowed only if approved
      if (user.role === "user") {
        if (!user.isApproved) {
          await authClient.signOut();
          router.push("/login");
          return;
        }

        setLoading(false);
        return;
      }

      // ❌ other roles blocked
      router.push("/login");
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return children;
}