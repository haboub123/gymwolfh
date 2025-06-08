import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageActivite = () => {
  const [activites, setActivites] = useState([]);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchActivites();
  }, []);

  const fetchActivites = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Activite/getAllActivites");
      setActivites(response.data.Activites);
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setNom("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        "http://localhost:5000/Activite/addActivite", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // Sécurisation de la réponse du backend
      const nouvelleActivite = response.data.Activite || response.data;
      setActivites([...activites, nouvelleActivite]);
      setNom("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Activite/deleteActiviteById/${id}`);
      setActivites(activites.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (id) => {
    const activite = activites.find((a) => a._id === id);
    if (activite) {
      setIsEditing(true);
      setEditId(id);
      setNom(activite.nom);
      setDescription(activite.description);
      // Si l'activité a une image, on prépare l'aperçu
      if (activite.image) {
        setImagePreview(`http://localhost:5000${activite.image}`);
      } else {
        setImagePreview(null);
      }
      setShowForm(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      await axios.put(
        `http://localhost:5000/Activite/updateActivite/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // Mettre à jour l'état local
      fetchActivites(); // Recharger toutes les activités pour avoir l'URL de l'image mise à jour
      
      setIsEditing(false);
      setEditId(null);
      setNom("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  // Sécurisation de la fonction de recherche
  const filteredActivites = activites.filter((a) =>
    (a?.nom || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Activités</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher une activité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleAddClick}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i>
          Ajouter une activité
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Modifier l'activité" : "Ajouter une activité"}
          </h3>
          <form onSubmit={isEditing ? handleUpdate : handleAdd} className="space-y-4">
            <input
              type="text"
              placeholder="Nom de l'activité"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
            
            {/* Ajout du champ d'upload d'image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Image de l'activité
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {/* Aperçu de l'image */}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="h-40 w-auto object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            
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
                    setNom("");
                    setDescription("");
                    setImage(null);
                    setImagePreview(null);
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

      {filteredActivites.length === 0 ? (
        <p className="text-gray-500">Aucune activité trouvée.</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3">Image</th>
              <th className="text-left px-6 py-3">Nom</th>
              <th className="text-left px-6 py-3">Description</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivites.map((activite) => (
              <tr key={activite._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  {activite.image ? (
                    <img
                      src={`http://localhost:5000${activite.image}`}
                      alt={activite.nom}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Pas d'image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{activite.nom}</td>
                <td className="px-6 py-4">{activite.description}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(activite._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
                  >
                    <i className="fas fa-edit"></i> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(activite._id)}
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

export default ManageActivite;