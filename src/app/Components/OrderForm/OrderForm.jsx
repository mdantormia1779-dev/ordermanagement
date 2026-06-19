"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Form, Label, TextField, FieldError } from "@heroui/react";
import { toast } from "react-toastify";

export default function OrderForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    details: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.details
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Order failed!");
        return;
      }

      toast.success("Order submitted successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        details: "",
      });
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-purple-100">
      <section className="flex container mx-auto items-center justify-center px-4 py-4">
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
              Place Your Order
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Fill all required fields
            </p>
          </div>

          <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NAME */}
              <TextField isRequired name="name">
                <Label>Full Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  classNames={{
                    inputWrapper:
                      "bg-gray-100 border-none px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-purple-500",
                    input:
                      "text-gray-800 placeholder:text-gray-400 outline-none focus:outline-none",
                  }}
                />
              </TextField>

              {/* PHONE */}
              <TextField isRequired name="phone">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter Your Phone Number"
                  classNames={{
                    inputWrapper:
                      "bg-gray-100 border-none px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-purple-500",
                    input:
                      "text-gray-800 placeholder:text-gray-400 outline-none focus:outline-none",
                  }}
                />
              </TextField>

              {/* Email */}
              <TextField isRequired name="phone">
                <Label>Email</Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Your Phone Number"
                  classNames={{
                    inputWrapper:
                      "bg-gray-100 border-none px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-purple-500",
                    input:
                      "text-gray-800 placeholder:text-gray-400 outline-none focus:outline-none",
                  }}
                />
              </TextField>

              {/* ADDRESS */}
              <TextField isRequired name="address">
                <Label>Address</Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter Your Address"
                  classNames={{
                    inputWrapper:
                      "bg-gray-100 border-none px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-purple-500",
                    input:
                      "text-gray-800 placeholder:text-gray-400 outline-none focus:outline-none",
                  }}
                />
              </TextField>
            </div>

            {/* DETAILS */}
            <TextField isRequired name="details">
              <Label>Details</Label>
              <Textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="Describe your details..."
                minRows={8}
                classNames={{
                  inputWrapper:
                    "bg-gray-100 border-none px-4 py-3 rounded-2xl h-40",
                  input: "text-gray-800 placeholder:text-gray-400 outline-none",
                }}
              />
            </TextField>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Submit Order
            </Button>
          </Form>
        </div>
      </section>
    </div>
  );
}
