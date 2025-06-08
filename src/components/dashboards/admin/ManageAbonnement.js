import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageAbonnement = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [type, setType] = useState("");
  const [prix, setPrix] = useState("");
  const [duree, setDuree] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAbonnements();
  }, []);

  const fetchAbonnements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Abonnement/getAllAbonnement");
      setAbonnements(response.data.abonnementListe || []);
    } catch (error) {
      console.error("Erreur lors du chargement des abonnements:", error);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setType("");
    setPrix("");
    setDuree("");
    setShowForm(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/Abonnement/addAbonnement", {
        type,
        prix: Number(prix),
        duree: Number(duree),
      });
      // Sécurisation de la réponse du backend
      const nouvelAbonnement = response.data.abonnement || response.data;
      setAbonnements([...abonnements, nouvelAbonnement]);
      setType("");
      setPrix("");
      setDuree("");
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Abonnement/deleteAbonnementById/${id}`);
      setAbonnements(abonnements.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (id) => {
    const abonnement = abonnements.find((a) => a._id === id);
    if (abonnement) {
      setIsEditing(true);
      setEditId(id);
      setType(abonnement.type);
      setPrix(abonnement.prix);
      setDuree(abonnement.duree);
      setShowForm(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/Abonnement/updateAbonnement/${editId}`, {
        type,
        prix: Number(prix),
        duree: Number(duree),
      });
      setAbonnements(
        abonnements.map((a) => (a._id === editId ? { ...a, type, prix, duree } : a))
      );
      setIsEditing(false);
      setEditId(null);
      setType("");
      setPrix("");
      setDuree("");
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  // Sécurisation de la fonction de recherche
  const filteredAbonnements = abonnements.filter((a) =>
    (a?.type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Abonnements</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher un abonnement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleAddClick}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i>
          Ajouter un abonnement
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Modifier l'abonnement" : "Ajouter un abonnement"}
          </h3>
          <form onSubmit={isEditing ? handleUpdate : handleAdd} className="space-y-4">
            <input
              type="text"
              placeholder="Type d'abonnement"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="number"
              placeholder="Prix"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="number"
              placeholder="Durée (jours)"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </button>
              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowForm(false);
                    setType("");
                    setPrix("");
                    setDuree("");
                  }}
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {filteredAbonnements.length === 0 ? (
        <p className="text-gray-500">Aucun abonnement trouvé.</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Prix</th>
              <th className="text-left px-6 py-3">Durée (jours)</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAbonnements.map((abonnement) => (
              <tr key={abonnement._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{abonnement.type}</td>
                <td className="px-6 py-4">{abonnement.prix} €</td>
                <td className="px-6 py-4">{abonnement.duree} jours</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(abonnement._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
                  >
                    <i className="fas fa-edit"></i> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(abonnement._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                  >
                    <i className="fas fa-trash"></i> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageAbonnement;