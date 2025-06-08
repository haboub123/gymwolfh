import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ManageActivité from "./ManageActivité"; // Assurez-vous que ce composant est bien importé

export default function ManageActivitéPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col  ">
        {/* Navbar */}
        <Navbar />

        {/* Manage Activité Content */}
        <main className="flex-1 p-6 pt-20 bg-white">
          <ManageActivité /> {/* Ici tu utilises le composant ManageActivité */}
        </main>
      </div>
    </div>
  );
}
