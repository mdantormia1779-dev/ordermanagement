"use client";

import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Form, Label, TextField } from "@heroui/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = "Valid email required";
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix all errors!");
      return;
    }

    try {
      setLoading(true);

      // 🔥 LOGIN
      const { error } = await authClient.signIn.email({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        // callbackURL: "/admin"
      });

      if (error) {
        toast.error(error.message || "Login failed!");
        setLoading(false);
        return;
      }

      // 🔥 wait small delay (fix session sync issue)
      await new Promise((res) => setTimeout(res, 300));

      const { data: session } = await authClient.getSession();
      const user = session?.user;
      console.log(user)

      if (!user) {
        toast.error("Session not found!");
        setLoading(false);
        return;
      }

      // 🔥 ADMIN
      if (user.role === "admin") {
        toast.success("Admin login successful!");
        router.push("/admin");
        return;
      }

      // 🔥 SUBADMIN
      if (user.role === "user") {
        if (!user.isApproved) {
          await authClient.signOut();
          toast.error("Admin approval pending!");
          setLoading(false);
          return;
        }

        toast.success("Login successful!");
        router.push("/admin");
        return;
      }

      toast.error("Unauthorized user!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-10">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-purple-700">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to your account
          </p>
        </div>

        {/* FORM */}
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <TextField isRequired name="email">
            <Label>Email</Label>
            <Input
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
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
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
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </TextField>

          {/* BUTTON */}
          <Button
            type="submit"
            isLoading={loading}
            disabled={loading}
            className="w-full bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] transition"
          >
            Login
          </Button>
        </Form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Don’t have an account?
        </p>

      </div>
    </div>
  );
};

export default LoginPage;