import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageAffectation = () => {
  const [clients, setClients] = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedAbonnementId, setSelectedAbonnementId] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [abonnementSearchTerm, setAbonnementSearchTerm] = useState("");
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchAbonnements();
    fetchAffectations();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/getAllUsers");
      // Adapter selon la structure de votre API
      setClients(response.data.users || []);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
    }
  };

  const fetchAbonnements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Abonnement/getAllAbonnement");
      setAbonnements(response.data.abonnementListe || []);
    } catch (error) {
      console.error("Erreur lors du chargement des abonnements:", error);
    }
  };

  const fetchAffectations = async () => {
    setLoading(true);
    try {
      // Cette requête devrait retourner les utilisateurs avec leurs abonnements
      const response = await axios.get("http://localhost:5000/user/getUsersWithAbonnements");
      setAffectations(response.data.usersWithAbonnements || []);
    } catch (error) {
      console.error("Erreur lors du chargement des affectations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAffect = async () => {
    if (!selectedUserId || !selectedAbonnementId) {
      alert("Veuillez sélectionner un client et un abonnement");
      return;
    }

    try {
      await axios.post("http://localhost:5000/Abonnement/affect", {
        userId: selectedUserId,
        abonnementId: selectedAbonnementId
      });
      alert("Abonnement affecté avec succès");
      
      // Réinitialiser les sélections
      setSelectedUserId("");
      setSelectedAbonnementId("");
      
      // Rafraîchir les données
      fetchAffectations();
    } catch (error) {
      console.error("Erreur lors de l'affectation:", error);
      alert("Erreur lors de l'affectation: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDesaffect = async (userId, abonnementId) => {
    try {
      await axios.post("http://localhost:5000/Abonnement/desaffect", {
        userId,
        abonnementId
      });
      alert("Désaffectation réussie");
      fetchAffectations();
    } catch (error) {
      console.error("Erreur lors de la désaffectation:", error);
      alert("Erreur lors de la désaffectation: " + (error.response?.data?.message || error.message));
    }
  };

  // Filtrage des clients et abonnements selon les termes de recherche
  const filteredClients = clients.filter(
    client => (client?.username || "").toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredAbonnements = abonnements.filter(
    abonnement => (abonnement?.type || "").toLowerCase().includes(abonnementSearchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestion des Affectations d'Abonnements</h2>

      {/* Formulaire d'affectation */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Affecter un abonnement</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Sélectionner un client</option>
              {filteredClients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.username} ({client.email})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Abonnement</label>
            <input
              type="text"
              placeholder="Rechercher un abonnement..."
              value={abonnementSearchTerm}
              onChange={(e) => setAbonnementSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <select
              value={selectedAbonnementId}
              onChange={(e) => setSelectedAbonnementId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Sélectionner un abonnement</option>
              {filteredAbonnements.map((abonnement) => (
                <option key={abonnement._id} value={abonnement._id}>
                  {abonnement.type} - {abonnement.prix}€ ({abonnement.duree} jours)
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAffect}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Affecter
        </button>
      </div>

      {/* Liste des affectations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-4 bg-gray-50 border-b">
          Liste des clients avec abonnements
        </h3>
        
        {loading ? (
          <div className="p-4 text-center">Chargement...</div>
        ) : affectations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune affectation trouvée
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abonnement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {affectations.map((affectation) => (
                <tr key={affectation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {affectation.username}
                    </div>
                    <div className="text-sm text-gray-500">{affectation.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {affectation.abonnementDetails?.type || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {affectation.abonnementDetails?.prix || "N/A"} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {affectation.abonnementDetails?.duree || "N/A"} jours
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => 
                        handleDesaffect(
                          affectation._id, 
                          affectation.abonnement
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Désaffecter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageAffectation;