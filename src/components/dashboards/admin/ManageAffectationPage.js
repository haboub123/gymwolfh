import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ManageAffectation from "./ManageAffectation";

export default function ManageAffectationPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col  ">
        {/* Navbar */}
        <Navbar />
        
        {/* Manage Affectation Content */}
        <main className="flex-1 p-6 pt-20 bg-white">
          <ManageAffectation />
        </main>
      </div>
    </div>
  );
}