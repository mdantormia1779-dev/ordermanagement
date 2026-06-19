"use client";

import useSWR from "swr";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Spinner } from "@nextui-org/react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AdminApproval() {
  const API = `${process.env.NEXT_PUBLIC_SERVER}/admin/requests`;

  const { data, mutate, isLoading } = useSWR(API, fetcher);

  // ================= ACTION =================
  const handleAction = async (id, action) => {
    try {
      const url =
        action === "approve"
          ? `${process.env.NEXT_PUBLIC_SERVER}/admin/approve/${id}`
          : `${process.env.NEXT_PUBLIC_SERVER}/admin/reject/${id}`;

      // ✅ FIXED METHOD (BOTH PATCH)
      const method = "PATCH";

      const res = await fetch(url, { method });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Action failed");
        return;
      }

      toast.success(
        action === "approve"
          ? "Subadmin Approved!"
          : "Request Rejected!"
      );

      mutate();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">
        Subadmin Requests
      </h1>

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center p-10">
          <Spinner label="Loading requests..." />
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && data?.length === 0 && (
        <p className="text-gray-500 text-center">
          No pending requests at the moment.
        </p>
      )}

      {/* LIST */}
      <div className="grid gap-4">
        {data?.map((u) => (
          <Card key={u._id} className="p-2 shadow-md">
            <CardBody className="flex flex-row justify-between items-center">

              {/* USER INFO */}
              <div>
                <p className="font-bold text-lg">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <Button
                  color="success"
                  size="sm"
                  variant="flat"
                  onClick={() => handleAction(u._id, "approve")}
                >
                  Approve
                </Button>

                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onClick={() => handleAction(u._id, "reject")}
                >
                  Reject
                </Button>
              </div>

            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}