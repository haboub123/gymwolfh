import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ActiviteDetail = () => {
  const { id } = useParams();
  const [activite, setActivite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivite = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/Activite/getActiviteById/${id}`);
        setActivite(response.data.Activite || null);
      } catch (error) {
        console.error("Erreur lors du chargement de l'activité:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivite();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date non définie";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div>Chargement...</div>;
  if (!activite) return <div>Activité non trouvée.</div>;

  return (
    <div className="p-6">
      <Link to="/activites" className="text-blue-500 hover:underline mb-4 inline-block">← Retour aux activités</Link>
      <h1 className="text-3xl font-bold mb-2">{activite.nom}</h1>
      <p className="text-gray-600 mb-4">{activite.description}</p>
      <h2 className="text-xl font-semibold mb-2">Séances associées :</h2>
      {activite.seances.length === 0 ? (
        <p className="text-gray-500">Aucune séance associée à cette activité.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Titre</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Heure</th>
                <th className="text-left px-4 py-2">Durée</th>
                <th className="text-left px-4 py-2">Salle</th>
              </tr>
            </thead>
            <tbody>
              {activite.seances.map((seance) => (
                <tr key={seance._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{seance.titre}</td>
                  <td className="px-4 py-2">{formatDate(seance.date)}</td>
                  <td className="px-4 py-2">{seance.heure || "Non définie"}</td>
                  <td className="px-4 py-2">{seance.duree || "Non définie"}</td>
                  <td className="px-4 py-2">{seance.salle?.nom || seance.salle || "Non définie"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiviteDetail;