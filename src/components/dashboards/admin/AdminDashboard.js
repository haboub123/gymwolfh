import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";
import { FaBell, FaTrash } from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/auth/login");
          return;
        }
        if (user.role !== "admin") {
          navigate("/");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
        navigate("/auth/login");
      }
    };
    checkAuth();

    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get("http://localhost:5000/notification/getAllNotifications", {
          params: { role: "admin" },
          withCredentials: true,
        });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
      }
    };
    fetchNotifications();
  }, [navigate]);

  // Fonction pour supprimer une notification
  const deleteNotification = async (notificationId) => {
    try {
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette notification ?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/notification/deleteNotificationById/${notificationId}`, {
        withCredentials: true,
      });

      // Mettre à jour la liste des notifications après suppression
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      
      // Optionnel : Afficher un message de succès
      alert("Notification supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      alert("Erreur lors de la suppression de la notification. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-yellow-400">Tableau de bord Admin</h2>
          <p className="mt-2 text-gray-300">
            Bienvenue, Admin ! Gérez les utilisateurs, les programmes et plus encore. Date d'aujourd'hui : {new Date().toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Section des Notifications avec Nouveau Design */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <FaBell className="text-lg" /> Notifications
            </h3>
            {notifications.length === 0 ? (
              <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center text-gray-500">
                Aucune notification pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${
                      notification.statut === "non lu"
                        ? "border-yellow-400 bg-opacity-90"
                        : "border-gray-700"
                    } transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">{notification.contenu}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(notification.dateEnvoi).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200"
                          title="Supprimer cette notification"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                        <Link
                          to="/notifications"
                          className="text-yellow-400 text-sm hover:underline"
                        >
                          Voir toutes
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/manage-activite"
              className="bg-gray-800 text-yellow-400 p-4 rounded-lg shadow-md hover:bg-gray-700 transition flex items-center justify-center"
            >
              Gérer les Activités
            </Link>
            <Link
              to="/admin/manage-seance"
              className="bg-gray-800 text-yellow-400 p-4 rounded-lg shadow-md hover:bg-gray-700 transition flex items-center justify-center"
            >
              Gérer les Séances
            </Link>
            <Link
              to="/admin/manage-salle"
              className="bg-gray-800 text-yellow-400 p-4 rounded-lg shadow-md hover:bg-gray-700 transition flex items-center justify-center"
            >
              Gérer les Salles
            </Link>
            <Link
              to="/admin/manage-coach"
              className="bg-gray-800 text-yellow-400 p-4 rounded-lg shadow-md hover:bg-gray-700 transition flex items-center justify-center"
            >
              Gérer les Coaches
            </Link>
            <Link
              to="/admin/manage-abonnement"
              className="bg-gray-800 text-yellow-400 p-4 rounded-lg shadow-md hover:bg-gray-700 transition flex items-center justify-center"
            >
              Gérer les Abonnements
            </Link>
            <Link
              to="/admin/manage-client"
              className="bg-gray-800 text-yellow-400 p-4 rounded-lg shadow-md hover:bg-gray-700 transition flex items-center justify-center"
            >
              Gérer les Clients
            </Link>
            <Link
              to="/admin/manage-avis"
              className="bg-gray-800 text-yellow-400 p-4 rounded-lg shadow-md hover:bg-gray-700 transition flex items-center justify-center"
            >
              Gérer les Avis
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}