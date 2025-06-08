import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FaTrash, FaShareAlt } from "react-icons/fa";
import UserDropdown from "../../Dropdowns/UserDropdown";

// Composant Navbar
const Navbar = () => {
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
};

// Composant Sidebar
const Sidebar = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const location = useLocation();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserName(user.username || user.name || "User");
        setUserRole(user.role || "guest");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur :", error);
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const adminLinks = [
    { path: "/", name: "Accueil", icon: "house" },
    { path: "/dashboard/admin", name: "Tableau de bord", icon: "home" },
    { path: "/admin/manage-activite", name: "Activités", icon: "activity" },
    { path: "/admin/manage-seance", name: "Séances", icon: "calendar" },
    { path: "/admin/manage-salle", name: "Salles", icon: "archive" },
    { path: "/admin/manage-coach", name: "Coaches", icon: "users" },
    { path: "/admin/manage-client", name: "Clients", icon: "user" },
    { path: "/admin/manage-abonnement", name: "Abonnements", icon: "credit-card" },
    { path: "/admin/manage-affectation", name: "Affectations", icon: "link" },
    { path: "/admin/manage-avis", name: "Avis", icon: "comment" },
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen flex flex-col fixed left-0 top-16 z-40">
      <div className="p-4 bg-gray-800">
        <h2 className="text-2xl font-bold text-yellow-400">Gym Wolf</h2>
        <p className="text-gray-400 text-sm">Gestion de Salle de Sport</p>
      </div>
      <div className="p-4 border-b border-gray-700 mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-xl font-bold text-yellow-400">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="font-medium text-white">{userName}</p>
            <p className="text-sm text-gray-400 capitalize">{userRole}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1">
        <ul className="px-2">
          {adminLinks.map((link) => (
            <li key={link.path} className="mb-1">
              <Link
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "bg-yellow-400 text-gray-900"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span className="mr-3">
                  <i className={`fas fa-${link.icon}`}></i>
                </span>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <ul>
          <li>
            <Link
              to="/auth/login"
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => {
                localStorage.removeItem("user");
                alert("Vous êtes déconnecté.");
              }}
            >
              <span className="mr-3">
                <i className="fas fa-sign-out-alt"></i>
              </span>
              Déconnexion
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

// Composant principal pour gérer les avis
const ManageAvisPage = () => {
  const [avisListe, setAvisListe] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger tous les avis au montage du composant
  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/avis/getAllAvis", {
          withCredentials: true,
        });
        console.log("Avis récupérés :", data.avisListe);
        setAvisListe(data.avisListe || []);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis:", error.response?.data || error.message);
        setLoading(false);
      }
    };
    fetchAvis();
  }, []);

  // Supprimer un avis
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
    try {
      await axios.delete(`http://localhost:5000/avis/deleteAvisById/${id}`, {
        withCredentials: true,
      });
      setAvisListe(avisListe.filter((avis) => avis._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.response?.data || error.message);
    }
  };

  // Basculer l'état de partage d'un avis
  const handleToggleShare = async (id) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/avis/toggleShare/${id}`,
        {},
        { withCredentials: true }
      );
      setAvisListe(
        avisListe.map((avis) =>
          avis._id === id ? { ...avis, isShared: data.avis.isShared } : avis
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du partage:", error.response?.data || error.message);
    }
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1  ">
          <Navbar />
          <div className="text-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher la liste des avis
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1  ">
        <Navbar />
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-blue-500 pb-2">
            Gestion des Avis
          </h2>

          {avisListe.length > 0 ? (
            <div className="space-y-6">
              {avisListe.map((avis) => (
                <div
                  key={avis._id}
                  className="bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-gray-800">
                      <span className="font-semibold">Note :</span> {avis.note}/5
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Client :</span>{" "}
                      {avis.client && avis.client.username ? avis.client.username : "Anonyme"}
                    </p>
                    <p className="text-gray-800 sm:col-span-2">
                      <span className="font-semibold">Commentaire :</span> {avis.commentaire}
                    </p>
                    <p className="text-gray-800 sm:col-span-2">
                      <span className="font-semibold">Date et heure :</span>{" "}
                      {avis.date
                        ? new Date(avis.date).toLocaleString("fr-FR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "N/A"}
                    </p>
                    <p className="text-gray-800 sm:col-span-2">
                      <span className="font-semibold">Partagé :</span>{" "}
                      {avis.isShared ? "Oui" : "Non"}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleToggleShare(avis._id)}
                      className={`flex items-center gap-2 ${
                        avis.isShared ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-600"
                      } text-white py-2 px-4 rounded-lg transition-all duration-200`}
                    >
                      <FaShareAlt /> {avis.isShared ? "Ne plus partager" : "Partager"}
                    </button>
                    <button
                      onClick={() => handleDelete(avis._id)}
                      className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200"
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">Aucun avis disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAvisPage;