import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ManageSalle from "./ManageSalle"; // Assurez-vous que ce composant est bien importé

export default function ManageSallePage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col  ">
        {/* Navbar */}
        <Navbar />

        {/* Manage Salle Content */}
        <main className="flex-1 p-6 pt-20 bg-white">
          <ManageSalle /> {/* Ici tu utilises le composant ManageSalle */}
        </main>
      </div>
    </div>
  );
}