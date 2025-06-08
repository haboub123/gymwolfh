import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllCoaches,
  deleteCoachById,
  addUserCoach,
  addCoachWithImage,
  updateUserById,
  getCoachImageUrl,
} from "../../../services/apiUser";

export default function ManageCoach({ color }) {
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    specialite: "",
    age: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    specialite: "",
    age: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const specialities = [
    "Musculation",
    "Cardio",
    "Fitness",
    "Yoga",
    "CrossFit",
    "Zumba",
    "Boxe",
    "Pilates",
    "kung-fu",
    "danse",
  ];

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const res = await getAllCoaches();
      const coachList = res?.coachs || res?.coaches || [];
      setCoaches(coachList);
      setFilteredCoaches(coachList);
      setError(null);
    } catch (error) {
      setError("Erreur lors du chargement des coaches.");
      setCoaches([]);
      setFilteredCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce coach ?")) return;
    setLoading(true);
    try {
      await deleteCoachById(id);
      setMessage({ text: "Coach supprimé avec succès!", type: "success" });
      const updatedList = coaches.filter((coach) => coach._id !== id);
      setCoaches(updatedList);
      setFilteredCoaches(updatedList);
    } catch (error) {
      setError("Erreur lors de la suppression du coach.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    const coach = coaches.find((c) => c._id === id);
    if (!coach) {
      setError("Coach introuvable.");
      return;
    }
    setSelectedCoach(coach);
    setFormData({
      username: coach.username || "",
      email: coach.email || "",
      specialite: coach.specialite || "",
      age: coach.age || "",
      phone: coach.phone || "",
    });
    setPreviewImage(getCoachImageUrl(coach.user_image, "https://via.placeholder.com/40"));
    setIsUpdateModalOpen(true);
    setFormErrors({ username: "", email: "", specialite: "", age: "", phone: "" });
  };

  const handleAddCoach = () => {
    setFormData({ username: "", email: "", specialite: "", age: "", phone: "" });
    setPreviewImage(null);
    setProfileImage(null);
    setIsAddModalOpen(true);
    setFormErrors({ username: "", email: "", specialite: "", age: "", phone: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 2MB.");
      return;
    }
    setProfileImage(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const validateForm = () => {
    const errors = { username: "", email: "", specialite: "", age: "", phone: "" };
    let isValid = true;

    // Validation des champs obligatoires
    if (!formData.username.trim()) {
      errors.username = "Le nom d'utilisateur est requis";
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
      isValid = false;
    }
    if (!formData.specialite) {
      errors.specialite = "La spécialité est requise";
      isValid = false;
    }
    if (!formData.age) {
      errors.age = "L'âge est requis";
      isValid = false;
    } else {
      const age = parseInt(formData.age, 10);
      if (age < 18) {
        errors.age = "L'âge doit être au minimum 18 ans";
        isValid = false;
      } else if (age > 55) {
        errors.age = "L'âge doit être au maximum 55 ans";
        isValid = false;
      }
    }
    if (!formData.phone.trim()) {
      errors.phone = "Le numéro de téléphone est requis";
      isValid = false;
    } else {
      const phoneRegex = /^\d{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = "Le numéro de téléphone doit contenir exactement 8 chiffres";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isAddModalOpen) {
        if (profileImage) {
          const formDataWithImage = new FormData();
          formDataWithImage.append("username", formData.username);
          formDataWithImage.append("email", formData.email);
          formDataWithImage.append("specialite", formData.specialite);
          formDataWithImage.append("age", formData.age);
          formDataWithImage.append("phone", formData.phone);
          formDataWithImage.append("user_image", profileImage);
          await addCoachWithImage(formDataWithImage);
        } else {
          await addUserCoach({
            username: formData.username,
            email: formData.email,
            specialite: formData.specialite,
            age: formData.age,
            phone: formData.phone,
          });
        }
        setMessage({ text: "Coach ajouté avec succès!", type: "success" });
      } else if (isUpdateModalOpen && selectedCoach) {
        await updateUserById(selectedCoach._id, {
          username: formData.username,
          email: formData.email,
          specialite: formData.specialite,
          age: formData.age,
          phone: formData.phone,
        });
        setMessage({ text: "Coach mis à jour avec succès!", type: "success" });
      }
      closeModal();
      await fetchCoaches();
    } catch (error) {
      setMessage({ text: error.message || "Une erreur s'est produite.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = coaches.filter((coach) =>
      coach.username.toLowerCase().includes(query)
    );
    setFilteredCoaches(filtered);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedCoach(null);
    setFormData({ username: "", email: "", specialite: "", age: "", phone: "" });
    setProfileImage(null);
    setPreviewImage(null);
    setError(null);
    setFormErrors({ username: "", email: "", specialite: "", age: "", phone: "" });
  };

  useEffect(() => {
    fetchCoaches();
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg " +
        (color === "light" ? "bg-white" : "bg-gray-800 text-white")
      }
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3
            className={
              "text-2xl font-semibold " +
              (color === "light" ? "text-gray-800" : "text-white")
            }
          >
            Liste des Coaches
          </h3>
          <button
            onClick={handleAddCoach}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm flex items-center"
            disabled={loading}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ajouter un Coach
          </button>
        </div>
      </div>
      {error && <div className="px-6 py-3 text-red-600">{error}</div>}
      {message.text && (
        <div
          className={`px-6 py-3 ${message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {message.text}
        </div>
      )}
      <div className="px-6 py-4">
        <input
          type="text"
          placeholder="Rechercher par nom d'utilisateur..."
          value={searchQuery}
          onChange={handleSearch}
          className="border px-4 py-2 rounded-lg w-full md:w-1/3"
          disabled={loading}
        />
      </div>
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement en cours...</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-6 py-3 text-left">Nom d'utilisateur</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Spécialité</th>
              <th className="px-6 py-3 text-left">Âge</th>
              <th className="px-6 py-3 text-left">Téléphone</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoaches.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  {loading ? "Chargement..." : "Aucun coach trouvé."}
                </td>
              </tr>
            ) : (
              filteredCoaches.map((coach) => (
                <tr key={coach._id} className="hover:bg-gray-50 border-b text-sm">
                  <td className="px-6 py-4 flex items-center">
                    <img
                      src={getCoachImageUrl(coach.user_image, "https://via.placeholder.com/40")}
                      className="h-10 w-10 rounded-full border object-cover"
                      alt={`Coach ${coach.username}`}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }}
                    />
                    <span className="ml-3">{coach.username}</span>
                  </td>
                  <td className="px-6 py-4">{coach.email}</td>
                  <td className="px-6 py-4">{coach.specialite || "Non spécifié"}</td>
                  <td className="px-6 py-4">{coach.age ? `${coach.age} ans` : "Non spécifié"}</td>
                  <td className="px-6 py-4">{coach.phone || "Non spécifié"}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleUpdate(coach._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(coach._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {(isAddModalOpen || isUpdateModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isAddModalOpen ? "Ajouter un nouveau Coach" : "Modifier un Coach"}
            </h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full border px-3 py-2 rounded ${formErrors.username ? "border-red-500" : ""}`}
                  required
                  disabled={loading}
                />
                {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full border px-3 py-2 rounded ${formErrors.email ? "border-red-500" : ""}`}
                  required
                  disabled={loading}
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Spécialité</label>
                <select
                  value={formData.specialite}
                  onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                  className={`w-full border px-3 py-2 rounded ${formErrors.specialite ? "border-red-500" : ""}`}
                  required
                  disabled={loading}
                >
                  <option value="">Sélectionner une spécialité</option>
                  {specialities.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {formErrors.specialite && <p className="text-red-500 text-sm mt-1">{formErrors.specialite}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Âge</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={`w-full border px-3 py-2 rounded ${formErrors.age ? "border-red-500" : ""}`}
                  placeholder="Entrer l'âge (18-55)"
                  min="18"
                  max="55"
                  required
                  disabled={loading}
                />
                {formErrors.age && <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full border px-3 py-2 rounded ${formErrors.phone ? "border-red-500" : ""}`}
                  placeholder="Ex: 12345678"
                  required
                  disabled={loading}
                />
                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Photo de profil (facultatif)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  name="user_image"
                  className="w-full border px-3 py-2 rounded"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Prévisualisation"
                      className="w-24 h-24 object-cover rounded-full border"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                  ) : isAddModalOpen ? "Ajouter" : "Mettre à jour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ManageCoach.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};

ManageCoach.defaultProps = {
  color: "light",
};