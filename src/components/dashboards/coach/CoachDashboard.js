import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarCoach from "./SidebarCoach";
import NavbarCoach from "./NavbarCoach";
import AvisList from "./AvisList";
import { FaTrash, FaBell } from "react-icons/fa";
import "./CoachDashboard.css";

export default function CoachDashboard() {
  const [seances, setSeances] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userString = localStorage.getItem("user");

  const getImageUrl = (imageName) => {
    if (!imageName) return "https://via.placeholder.com/40";
    return `http://localhost:5000/uploads/${imageName}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userString) {
        window.location.href = "/login";
        return;
      }
      const user = JSON.parse(userString);
      try {
        const token = localStorage.getItem("jwt_token_9antra");
        const response = await axios.get(`http://localhost:5000/users/getUserById/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          email: userData.email,
          password: "",
          phone: userData.phone || "",
        });
        setPreviewImage(getImageUrl(userData.user_image));
      } catch (error) {
        setError("Erreur lors du chargement du profil.");
      }
    };

    const fetchSeances = async () => {
      if (!userString) return;
      const user = JSON.parse(userString);
      const coachId = user._id;
      try {
        const response = await axios.get("http://localhost:5000/Seance/getAllSeances");
        const allSeances = response.data.seances || [];
        const coachSeances = allSeances.filter(seance => seance.coachs.includes(coachId));
        setSeances(coachSeances);
      } catch (error) {
        console.error("Erreur lors de la récupération des séances:", error);
      }
    };

    const fetchNotifications = async () => {
      if (!userString) return;
      const user = JSON.parse(userString);
      try {
        const response = await axios.get("http://localhost:5000/notification/getAllNotifications", {
          params: { userId: user._id, role: user.role },
          withCredentials: true,
        });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
      }
    };

    fetchUser();
    fetchSeances();
    fetchNotifications();
  }, [userString]);

  const deleteNotification = async (notificationId) => {
    try {
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette notification ?");
      if (!confirmDelete) return;
      await axios.delete(`http://localhost:5000/notification/deleteNotificationById/${notificationId}`, {
        withCredentials: true,
      });
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      alert("Notification supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      alert("Erreur lors de la suppression de la notification. Veuillez réessayer.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 2MB.");
      return;
    }
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token_9antra");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    if (formData.password) formDataToSend.append("password", formData.password);
    if (formData.phone) formDataToSend.append("phone", formData.phone);
    if (profileImage) {
      console.log("Fichier uploadé :", profileImage.name, profileImage.size);
      formDataToSend.append("user_image", profileImage); // Assure-toi que le champ correspond à "user_image"
    }

    try {
      const response = await axios.put(`http://localhost:5000/users/updateCoachProfile/${user._id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      const updatedUser = response.data.user;
      setMessage(response.data.message);
      setUser(updatedUser);
      setFormData({
        email: updatedUser.email,
        password: "",
        phone: updatedUser.phone || "",
      });
      const newImageUrl = getImageUrl(updatedUser.user_image);
      setPreviewImage(newImageUrl);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditModalOpen(false);
      setError("");
      setProfileImage(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour du profil.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/users/logout", {}, { withCredentials: true });
      localStorage.removeItem("jwt_token_9antra");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      setError("Erreur lors de la déconnexion.");
    }
  };

  if (!user) return <div className="text-white text-center p-6">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SidebarCoach
        user={user}
        previewImage={previewImage}
        onLogout={handleLogout}
        onEditProfile={() => setIsEditModalOpen(true)}
        getImageUrl={getImageUrl}
      />
      <NavbarCoach />
      <main className="  pt-16 p-6">
        <h2 className="text-2xl font-bold text-yellow-400">
          <i className="fas fa-tachometer-alt mr-2"></i> Tableau de bord Coach
        </h2>
        <p className="mt-2 text-gray-300">Bienvenue, Coach {user.username} ! Voici vos séances planifiées.</p>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <FaBell className="text-lg" /> Notifications
          </h3>
          {notifications.length === 0 ? (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center text-gray-500">
              <i className="fas fa-exclamation-circle mr-2"></i> Aucune notification pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification._id}
                  className={`bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${notification.statut === "non lu"
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
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200 ml-4"
                      title="Supprimer cette notification"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Mes Séances</h3>
          {seances.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {seances.map((seance) => (
                <div key={seance._id} className="bg-gray-800 shadow-md rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-yellow-400">{seance.titre}</h3>
                  <p className="text-sm text-gray-300 mb-1"><i className="fas fa-calendar-alt mr-1"></i> {formatDate(seance.date)}</p>
                  <p className="text-gray-300"><i className="fas fa-clock mr-1"></i> Heure : {seance.heure}</p>
                  <p className="text-gray-300"><i className="fas fa-hourglass-start mr-1"></i> Durée : {seance.duree} min</p>
                  <p className="text-gray-300"><i className="fas fa-dumbbell mr-1"></i> Activité : {seance.activite?.nom}</p>
                  <p className="text-gray-300"><i className="fas fa-map-marker-alt mr-1"></i> Salle : {seance.salle?.nom}</p>
                  <div className="mt-3">
                    <AvisList seanceId={seance._id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center text-gray-500">
              <i className="fas fa-exclamation-circle mr-2"></i> Aucune séance assignée.
            </div>
          )}
        </div>
      </main>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">Modifier Profil</h2>
            {message && <p className="mb-2 text-green-400">{message}</p>}
            {error && <p className="mb-2 text-red-400">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block">Nouveau Mot de Passe (laisser vide pour ne pas changer)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="block">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="block">Photo de Profil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  name="user_image" // Ajoute cet attribut
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 mt-2 rounded-full object-cover border border-gray-600"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                  />
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-600 p-2 rounded hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 p-2 rounded hover:bg-blue-700"
                >
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}