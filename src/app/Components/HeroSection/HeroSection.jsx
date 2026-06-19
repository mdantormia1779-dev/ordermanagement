"use client"
import { Button } from "@nextui-org/react";
import React from "react";

const HeroSection = () => {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-purple-50 via-white to-purple-100">
        <div className="container mx-auto px-6 py-24 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Fast & Reliable <br />
              <span className="text-purple-600">Service Ordering System</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Place your order in seconds. We deliver high-quality service with
              fast response, smooth experience, and dedicated support you can
              trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="bg-purple-600 text-white px-8 py-3 shadow-lg hover:scale-105 transition-transform">
                Get Started
              </Button>

              <Button
                variant="bordered"
                className="border-purple-500 text-purple-600 px-8 py-3"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
