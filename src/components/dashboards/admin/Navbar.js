import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserDropdown from "../../Dropdowns/UserDropdown";

export default function Navbar() {
  const [userName, setUserName] = useState("Utilisateur");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const getUserInfo = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.username) {
          setUserName(user.username);
        } else if (user && user.name) {
          setUserName(user.name);
        } else {
          setUserName("Utilisateur");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des infos utilisateur :", error);
        setUserName("Utilisateur");
      }
    };

    const updateDateTime = () => {
      try {
        const now = new Date();
        setCurrentDateTime(
          now.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) +
            " " +
            now.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }) +
            " CET"
        );
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la date/heure :", error);
        setCurrentDateTime(new Date().toLocaleString());
      }
    };

    getUserInfo();
    updateDateTime();

    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-700 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-yellow-400 mr-4">
              Gym Wolf
            </Link>
            <Link to="/" className="text-sm text-gray-300 hover:text-yellow-400">
              Accueil
            </Link>
          </div>

          <form className="hidden md:block flex-1 max-w-lg mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-800 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-yellow-400 focus:border-yellow-400 block w-full pl-10 p-2"
                placeholder="Rechercher..."
              />
            </div>
          </form>

          <div className="flex items-center">
            <div className="mr-4 text-sm text-gray-400">
              {currentDateTime || "Chargement..."}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-200">{`Bonjour, ${userName}`}</span>
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  );
}