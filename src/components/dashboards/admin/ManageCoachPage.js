import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ManageCoach from "./ManageCoach";

export default function ManageCoachPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col  ">
        {/* Navbar */}
        <Navbar />

        {/* Manage Coach Content */}
        <main className="flex-1 p-6 pt-20 bg-white">
          <ManageCoach color="light" />
        </main>
      </div>
    </div>
  );
}