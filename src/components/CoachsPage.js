import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { getCoachImageUrl } from "../services/apiUser";

const CoachsPage = () => {
  const [coachs, setCoachs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/users/coachs")
      .then((res) => {
        setCoachs(res.data.coachs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des coachs", err);
        setError("Impossible de charger la liste des coachs");
        setLoading(false);
      });
  }, []);

  // Gestionnaire d'erreur pour les images
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/150"; // Image par défaut
  };

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen" style={{ backgroundColor: "#1e293b" }}>
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: "#fbbf24" }}
        >
          Nos Entraîneurs
        </h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-white">Chargement des coachs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8" style={{ color: "#ef4444" }}>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coachs.map((coach) => (
              <div
                key={coach._id}
                className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#334155", border: "1px solid #475569" }}
              >
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={getCoachImageUrl(coach.user_image, "https://via.placeholder.com/150")}
                    alt={`Coach ${coach.username}`}
                    className="w-32 h-32 rounded-full object-cover mb-3"
                    style={{ border: "3px solid #fbbf24" }}
                    onError={handleImageError}
                  />
                  <h2 className="text-xl font-semibold text-white text-center">
                    {coach.username}
                  </h2>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="font-medium" style={{ color: "#fbbf24" }}>
                      Email:
                    </span>
                    <span className="text-gray-300 ml-2">{coach.email}</span>
                  </p>
                  <p>
                    <span className="font-medium" style={{ color: "#fbbf24" }}>
                      Spécialité:
                    </span>
                    <span className="text-gray-300 ml-2">
                      {coach.specialite || "Non précisée"}
                    </span>
                  </p>
                  {coach.age && (
                    <p>
                      <span
                        className="font-medium"
                        style={{ color: "#fbbf24" }}
                      >
                        Âge:
                      </span>
                      <span className="text-gray-300 ml-2">{coach.age} ans</span>
                    </p>
                  )}
                  {coach.phone && (
                    <p>
                      <span
                        className="font-medium"
                        style={{ color: "#fbbf24" }}
                      >
                        Téléphone:
                      </span>
                      <span className="text-gray-300 ml-2">
                        {coach.phone || "Non précisé"}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CoachsPage;