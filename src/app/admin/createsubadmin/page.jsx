"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Form, Label, TextField } from "@heroui/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // UI same রাখলাম
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // input change
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // role change (UI same but logic controlled)
  const handleRoleChange = (key) => {
    setForm((prev) => ({
      ...prev,
      role: key,
    }));
  };

  // validation
  const validate = () => {
    let newErrors = {};

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!form.name) newErrors.name = "Name required";
    if (!form.email || !emailRegex.test(form.email))
      newErrors.email = "Valid email required";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Minimum 6 characters required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix all errors!");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        name: form.name.trim(),

        // 🔥 SECURITY FIX (role control backend-ready)
        data: {
          role: "user",        // ❗ force করা হলো
          isApproved: false,       // ❗ admin approval system এর জন্য
        },
      });

      if (error) {
        toast.error(error.message || "Signup failed!");
        return;
      }

      toast.success("Sub Admin account created! Waiting for admin approval.");

      router.push("/admin");
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Something went wrong!");
    } finally {
    }
  };

  return (
    <div className="min-h-screen flex items-center p-10 justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-10 md:p-10">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-purple-700">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register as Admin or Sub Admin
          </p>
        </div>

        {/* FORM */}
        <Form className="flex text-black flex-col gap-4" onSubmit={handleSubmit}>
          {/* NAME */}
          <TextField isRequired name="name">
            <Label>Full Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              classNames={{
                inputWrapper:
                  "bg-gray-100 px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-purple-500",
                  input:
                  "text-gray-800 placeholder:text-gray-400 outline-none",
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </TextField>

          {/* EMAIL */}
          <TextField isRequired name="email">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              classNames={{
                inputWrapper:
                  "bg-gray-100 px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-purple-500",
                  input:
                  "text-gray-800 placeholder:text-gray-400 outline-none",
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </TextField>

          {/* PASSWORD */}
          <TextField isRequired name="password">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="******"
              classNames={{
                inputWrapper:
                  "bg-gray-100 px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-purple-500",
                  input:
                  "text-gray-800 placeholder:text-gray-400 outline-none",
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </TextField>

          {/* ROLE (UI same but backend controlled) */}
          <TextField isRequired name="role">
            <Label>Role</Label>

            <Dropdown>
              <DropdownTrigger>
                <Button className="w-full justify-between bg-gray-100 px-4 py-2 rounded-full">
                  {form.role ? form.role.toUpperCase() : "Select Role"}
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Role Select"
                onAction={(key) => handleRoleChange(key)}
                className="w-full min-w-94 flex justify-center items-center bg-white shadow-lg rounded-xl p-1"
              >
                <DropdownItem key="admin">
                  <div className="flex justify-between items-center w-full">
                    <span>Admin</span>
                    {form.role === "admin" && (
                      <span className="text-green-500 font-bold">✔</span>
                    )}
                  </div>
                </DropdownItem>

                <DropdownItem key="user">
                  <div className="flex justify-between items-center w-full">
                    <span>Sub Admin</span>
                    {form.role === "user" && (
                      <span className="text-green-500 font-bold">✔</span>
                    )}
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </TextField>

          {/* BUTTON */}
          <Button
            type="submit"
            isLoading={loading}
            disabled={loading}
            className="w-full bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}