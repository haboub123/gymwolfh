import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageSalle = () => {
  const [salles, setSalles] = useState([]);
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Salle/getAllSalles");
      setSalles(response.data.salles || []);
    } catch (error) {
      console.error("Erreur lors du chargement des salles:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/Salle/addsalle", {
        nom,
        capacite,
        description,
      });
      setNom("");
      setCapacite("");
      setDescription("");
      setShowForm(false);
      fetchSalles();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error.response?.data || error.message);
      alert("Erreur lors de l'ajout: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (id) => {
    const salle = salles.find((s) => s._id === id);
    if (salle) {
      setIsEditing(true);
      setEditId(id);
      setNom(salle.nom || "");
      setCapacite(salle.capacite || "");
      setDescription(salle.description || "");
      setShowForm(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/Salle/updateSalle/${editId}`, {
        nom,
        capacite,
        description,
      });
      setIsEditing(false);
      setEditId(null);
      setNom("");
      setCapacite("");
      setDescription("");
      setShowForm(false);
      fetchSalles();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.response?.data || error.message);
      alert("Erreur lors de la mise à jour: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Salle/deleteSalle/${id}`);
      setSalles(salles.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowForm(false);
    setNom("");
    setCapacite("");
    setDescription("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Salles</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            setIsEditing(false);
            setNom("");
            setCapacite("");
            setDescription("");
            setShowForm(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i>
          Ajouter une salle
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Modifier la salle" : "Ajouter une salle"}
          </h3>
          <form onSubmit={isEditing ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                id="nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="capacite" className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
              <input
                id="capacite"
                type="number"
                value={capacite}
                onChange={(e) => setCapacite(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </button>
              <button
                onClick={handleCancel}
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {salles.length === 0 ? (
        <p className="text-gray-500">Aucune salle trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3">Nom</th>
                <th className="text-left px-6 py-3">Capacité</th>
                <th className="text-left px-6 py-3">Description</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salles.map((salle) => (
                <tr key={salle._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{salle.nom}</td>
                  <td className="px-6 py-4">{salle.capacite}</td>
                  <td className="px-6 py-4">{salle.description || "N/A"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(salle._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
                    >
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(salle._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                    >
                      <i className="fas fa-trash"></i> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageSalle;