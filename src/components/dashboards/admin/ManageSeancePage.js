import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ManageSeance from "./ManageSeance"; // Assure-toi que le chemin est correct

export default function ManageSeancePage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col  ">
        {/* Navbar */}
        <Navbar />

        {/* Manage Séance Content */}
        <main className="flex-1 p-6 pt-20 bg-white">
          <ManageSeance />
        </main>
      </div>
    </div>
  );
}

