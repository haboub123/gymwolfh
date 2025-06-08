import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import ProfileModal from "../ProfileModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <nav className="bg-black text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* "Gym Wolf" avec "Gym" en blanc, "Wolf" en jaune, suivi du logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-wide">
            <span className="text-white">Gym</span>
            <span className="text-yellow-400">Wolf</span>
          </span>
          <img src={logo} alt="Gym Wolf Logo" className="h-8 w-8" />
        </div>

        {/* Menu principal */}
        <div className="flex items-center gap-8">
          <ul className="hidden md:flex gap-8 font-medium items-center">
            <li className="hover:text-yellow-400 transition">
              <a href="/">Accueil</a>
            </li>
            <li className="hover:text-yellow-400 transition">
              <a href="/activites">Nos Activités</a>
            </li>
            <li className="hover:text-yellow-400 transition">
              <a href="/coachs">Nos entraineurs</a>
            </li>
            <li className="hover:text-yellow-400 transition">
              <a href={user?.role === "client" ? "/mes-abonnements" : "/abonnement"}>
                {user?.role === "client" ? "Mes abonnements" : "Nos abonnements"}
              </a>
            </li>
            {user?.role === "client" && (
              <li className="hover:text-yellow-400 transition">
                <a href="/mes-reservations">Mes Réservations</a>
              </li>
            )}
            {!user ? (
              <li className="hover:text-yellow-400 transition">
                <a href="/auth/login">Connexion</a>
              </li>
            ) : (
              <li
                className="hover:text-yellow-400 transition cursor-pointer"
                onClick={handleLogout}
              >
                Déconnexion
              </li>
            )}
          </ul>
          {/* Nom de l'adhérent avec style et position améliorés */}
          {user && (
            <div className=" top-8 right-8 z-20">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                title="Modifier mon profil"
              >
                <svg 
                  className="w-8 h-8 text-gray-700 group-hover:text-yellow-500 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 space-y-3 px-4">
          <a href="/" className="block hover:text-yellow-400">Accueil</a>
          <a href="/activites" className="block hover:text-yellow-400">Nos Activités</a>
          <a href="/coachs" className="block hover:text-yellow-400">Nos entraineurs</a>
          <a
            href={user?.role === "client" ? "/mes-abonnements" : "/abonnement"}
            className="block hover:text-yellow-400"
          >
            {user?.role === "client" ? "Mes abonnements" : "Nos abonnements"}
          </a>
          {user?.role === "client" && (
            <a href="/mes-reservations" className="block hover:text-yellow-400">
              Mes Réservations
            </a>
          )}
          {!user ? (
            <a href="/auth/login" className="block hover:text-yellow-400">Connexion</a>
          ) : (
            <button onClick={handleLogout} className="block hover:text-yellow-400">
              Déconnexion
            </button>
          )}
          
          {/* Nom de l'adhérent dans le menu mobile */}
          {user && (
            <div className="absolute top-8 right-8 z-20">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                title="Modifier mon profil"
              >
                <svg 
                  className="w-8 h-8 text-gray-700 group-hover:text-yellow-500 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      <ProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdate={handleUserUpdate}
      />
    </nav>
  );
}