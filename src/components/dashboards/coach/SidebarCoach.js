import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarCoach({ user, previewImage, onLogout, onEditProfile, getImageUrl }) {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("https://via.placeholder.com/40");
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.username || storedUser.name || "Coach");
    }

    // Priorité d'affichage de l'image
    if (previewImage) {
      setUserImage(previewImage);
    } else if (user?.user_image) {
      setUserImage(getImageUrl(user.user_image));
    } else if (storedUser?.user_image) {
      setUserImage(getImageUrl(storedUser.user_image));
    }
  }, [user, previewImage, getImageUrl]);

  const isActive = (path) => location.pathname === path;

  const links = [
    { path: "/dashboard/coach", name: "Tableau de bord", icon: "tachometer-alt" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 shadow-lg z-40">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-yellow-400">Coach Gym Wolf</h1>
      </div>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src={userImage}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
            onError={(e) => {
              console.log("Erreur de chargement de l'image dans Sidebar:", userImage);
              e.target.src = "https://via.placeholder.com/40";
            }}
          />
          <div>
            <p className="text-white font-medium">{userName}</p>
            <p className="text-gray-400 text-sm">Coach</p>
          </div>
        </div>
      </div>
      <nav className="mt-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors ${isActive(link.path) ? "bg-gray-700 border-r-4 border-yellow-400" : ""}`}
          >
            <i className={`fas fa-${link.icon} mr-3`}></i>
            {link.name}
          </Link>
        ))}
        <Link
          to="/"
          className="flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors"
        >
          <i className="fas fa-home mr-3"></i>
          Accueil
        </Link>
        <button
          onClick={onEditProfile}
          className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors text-left"
        >
          <i className="fas fa-edit mr-3"></i>
          Modifier Profil
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors text-left"
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          Déconnexion
        </button>
      </nav>
    </div>
  );
}