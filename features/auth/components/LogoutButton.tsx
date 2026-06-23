"use client";

import { logoutAction } from "../actions/authAction";
import { useState } from "react";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition duration-200"
    >
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
