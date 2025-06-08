import React, { useState, useEffect } from "react";
import axios from "axios";

const AvisList = ({ seanceId }) => {
  const [avisListe, setAvisListe] = useState([]);

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:5000/avis/getAvisBySeance/${seanceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Avis récupérés pour la séance :", data.avisListe);
        setAvisListe(data.avisListe || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis", error);
      }
    };
    fetchAvis();
  }, [seanceId]);

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-yellow-400">Avis sur cette séance</h4>
      {avisListe.length > 0 ? (
        avisListe.map((avis) => (
          <div key={avis._id} className="bg-gray-700 p-3 mt-2 rounded-lg border border-gray-600">
            <p className="text-white font-medium">{avis.client?.username || "Anonyme"}</p>
            <p className="text-gray-300 text-sm">
              <i className="fas fa-calendar-alt mr-1"></i>{" "}
              {new Date(avis.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} à{" "}
              {new Date(avis.createdAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-gray-300 text-sm">
              <i className="fas fa-star mr-1"></i> Note : {avis.note}/5
            </p>
            <p className="text-gray-300 text-sm">
              <i className="fas fa-comment mr-1"></i> Commentaire : {avis.commentaire || "Aucun commentaire"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm mt-2">Aucun avis pour cette séance.</p>
      )}
    </div>
  );
};

export default AvisList;