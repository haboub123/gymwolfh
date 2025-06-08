import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ManageAbonnement from "./ManageAbonnement";

export default function ManageAbonnementPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col  ">
        {/* Navbar */}
        <Navbar />
        
        {/* Manage Abonnement Content */}
        <main className="flex-1 p-6 pt-20 bg-white">
          <ManageAbonnement />
        </main>
      </div>
    </div>
  );
}