"use client";

import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F6FB]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-96 w-full mx-8">
        <h2 className="text-2xl font-semibold text-[#384B65] mb-6 text-center">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#E1E8F1] p-3 rounded-lg text-[#384B65] focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#E1E8F1] p-3 rounded-lg text-[#384B65] focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
            required
          />
          <button
            type="submit"
            id="Connexion"
            aria-label="Connexion"
            className="bg-[#0369A1] text-white py-3 rounded-lg font-semibold hover:bg-[#025f8d] transition-colors"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
