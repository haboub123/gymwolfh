import React, { useState, useEffect } from "react";
import UserDropdown from "../../Dropdowns/UserDropdown";
import { Link } from "react-router-dom";

export default function NavbarCoach() {
  const [userName, setUserName] = useState("Coach");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.username || user.name || "Coach");
    }

    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString("fr-FR") +
        " " +
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }) +
        " CET"
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">Gym Wolf</Link>
        <div className="text-sm text-gray-500">{currentDateTime}</div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Bonjour, {userName}</span>
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
}
