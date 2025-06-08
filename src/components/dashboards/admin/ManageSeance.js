import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageSeance = () => {
  const [seances, setSeances] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [duree, setDuree] = useState("");
  const [salle, setSalle] = useState("");
  const [salles, setSalles] = useState([]);
  const [coachs, setCoachs] = useState([]);
  const [activite, setActivite] = useState("");
  const [activites, setActivites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [coach, setCoach] = useState(""); // Initialisé comme chaîne vide

  useEffect(() => {
    fetchCoachs();
    fetchSalles();
    fetchSeances();
    fetchActivites();
  }, []);

  const fetchCoachs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/coachs");
      setCoachs(response.data.coachs || []);
    } catch (error) {
      console.error("Erreur lors du chargement des coachs:", error);
    }
  };

  const fetchSalles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/salle/getAllSalles");
      setSalles(response.data.salles || []);
    } catch (error) {
      console.error("Erreur lors du chargement des salles:", error);
    }
  };

  const fetchSeances = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Seance/getAllSeancesWithReservationCount");
      setSeances(response.data.seances || []);
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    }
  };

  const fetchActivites = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Activite/getAllActivites");
      setActivites(response.data.Activites || []);
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      console.log("Données envoyées à l'API:", {
        titre,
        description,
        date: formattedDate,
        heure,
        duree,
        salle,
        activite,
        coach
      });
      const response = await axios.post("http://localhost:5000/Seance/addseance", {
        titre,
        description,
        date: formattedDate,
        heure,
        duree,
        salle,
        activite,
      });

      if (coach) {
        await axios.put("http://localhost:5000/Seance/affect", {
          userId: coach,
          seanceId: response.data.Seance._id
        });
      }

      setTitre("");
      setDescription("");
      setDate("");
      setHeure("");
      setDuree("");
      setSalle("");
      setActivite("");
      setCoach("");
      setShowForm(false);
      fetchSeances(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error.response?.data || error.message);
      alert("Erreur lors de l'ajout: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (id) => {
    const seance = seances.find((s) => s._id === id);
    if (seance) {
      setIsEditing(true);
      setEditId(id);
      setTitre(seance.titre || "");
      setDescription(seance.description || "");
      setDate(seance.date ? seance.date.split('T')[0] : "");
      setHeure(seance.heure || "");
      setDuree(seance.duree || "");
      setSalle(seance.salle?.nom || seance.salle || "");
      setActivite(seance.activite?._id || seance.activite || "");
      setCoach(seance.coachs?.[0] || ""); // Sélectionner le premier coach si plusieurs
      setShowForm(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      await axios.put(`http://localhost:5000/Seance/updateSeance/${editId}`, {
        titre,
        description,
        date: formattedDate,
        heure,
        duree,
        salle,
        activite,
      });

      if (coach && (!seances.find(s => s._id === editId)?.coachs?.includes(coach))) {
        await axios.put("http://localhost:5000/Seance/affect", {
          userId: coach,
          seanceId: editId
        });
      }

      setIsEditing(false);
      setEditId(null);
      setTitre("");
      setDescription("");
      setDate("");
      setHeure("");
      setDuree("");
      setSalle("");
      setActivite("");
      setCoach("");
      setShowForm(false);
      fetchSeances();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.response?.data || error.message);
      alert("Erreur lors de la mise à jour: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Seance/deleteSeanceById/${id}`);
      setSeances(seances.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowForm(false);
    setTitre("");
    setDescription("");
    setDate("");
    setHeure("");
    setDuree("");
    setSalle("");
    setActivite("");
    setCoach("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date non définie";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "Date invalide";
    }
  };
  const getSeanceStatus = (count) => {
    if (count === 0) return { status: "Aucune", color: "text-gray-500", bg: "bg-gray-100" };
    if (count <= 2) return { status: "Faible", color: "text-red-600", bg: "bg-red-100" };
    if (count <= 5) return { status: "Moyen", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { status: "Succès", color: "text-green-600", bg: "bg-green-100" };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Séances</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher une séance..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={() => {
            setIsEditing(false);
            setTitre("");
            setDescription("");
            setDate("");
            setHeure("");
            setDuree("");
            setSalle("");
            setActivite("");
            setCoach("");
            setShowForm(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i>
          Ajouter une séance
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Modifier la séance" : "Ajouter une séance"}
          </h3>
          <form onSubmit={isEditing ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                id="titre"
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
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
                required
                rows="3"
              ></textarea>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="heure" className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                id="heure"
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="duree" className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
              <input
                id="duree"
                type="text"
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="coach" className="block text-sm font-medium text-gray-700 mb-1">Coach</label>
              <select
                id="coach"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Sélectionnez un coach</option>
                {coachs.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="salle" className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <select
                id="salle"
                value={salle}
                onChange={(e) => setSalle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Sélectionnez une salle</option>
                {salles.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="activite" className="block text-sm font-medium text-gray-700 mb-1">Activité</label>
              <select
                id="activite"
                value={activite}
                onChange={(e) => setActivite(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Sélectionnez une activité</option>
                {activites.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.nom}
                  </option>
                ))}
              </select>
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

      {seances.length === 0 ? (
        <p className="text-gray-500">Aucune séance trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3">Titre</th>
                <th className="text-left px-6 py-3">Description</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Heure</th>
                <th className="text-left px-6 py-3">Durée</th>
                <th className="text-left px-6 py-3">Salle</th>
                <th className="text-left px-6 py-3">Activité</th>
                <th className="text-left px-6 py-3">Reservé(s)</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seances
                .filter((s) => (s?.titre || "").toLowerCase().includes(searchTerm.toLowerCase()))
                .map((seance) => {
                  const { status, color, bg } = getSeanceStatus(seance.count || 0);
                  return (
                    <tr key={seance._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{seance.titre}</td>
                      <td className="px-6 py-4">{seance.description}</td>
                      <td className="px-6 py-4">{formatDate(seance.date)}</td>
                      <td className="px-6 py-4">{seance.heure || "Non définie"}</td>
                      <td className="px-6 py-4">{seance.duree || "Non définie"}</td>
                      <td className="px-6 py-4">{seance.salle?.nom || seance.salle || "Non définie"}</td>
                      <td className="px-6 py-4">{seance.activite?.nom || "Non définie"}</td>
                      <td className="px-6 py-4">{seance.count || "0"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${bg} ${color}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(seance._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
                        >
                          <i className="fas fa-edit"></i> Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(seance._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                        >
                          <i className="fas fa-trash"></i> Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                }
                )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageSeance;