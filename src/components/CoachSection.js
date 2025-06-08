import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import placeholder from "../assets/img/team-4-470x470.png";
import { getCoachImageUrl } from "../services/apiUser"; // Ajoute cette importation

export default function CoachSection() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/users/coachs")
      .then((res) => {
        if (res.data && res.data.coachs) {
          setCoaches(res.data.coachs.slice(0, 3)); // max 3 coachs affichés
        } else {
          setCoaches([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des coachs :", err);
        setError("Impossible de charger les coachs. Veuillez réessayer plus tard.");
        setLoading(false);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder; // Image de secours si l'image n'est pas trouvée
  };

  return (
    <section className="pt-20 pb-48 bg-gradient-to-t from-blueGray-100 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-gray-900">Découvrez Nos Coachs d'Excellence</h2>
          <p className="text-blueGray-500 mt-4">
            Des experts passionnés prêts à vous propulser vers vos objectifs.
          </p>
        </div>

        <div className="flex flex-wrap justify-center">
          {loading ? (
            <p className="text-blueGray-500">Chargement des coachs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : coaches.length > 0 ? (
            coaches.map((coach, i) => (
              <div key={i} className="w-full md:w-4/12 lg:w-3/12 px-4 mb-12">
                <div className="px-6 text-center">
                  <img
                    alt={`coach-${coach.username}`}
                    src={getCoachImageUrl(coach.user_image, placeholder)} // Utilise getCoachImageUrl
                    className="shadow-lg rounded-full mx-auto max-w-120-px h-120-px object-cover transform hover:scale-110 transition-all duration-300"
                    onError={handleImageError}
                  />
                  <div className="pt-6">
                    <h5 className="text-xl font-bold text-gray-900">
                      {coach.username || `Coach ${i + 1}`}
                    </h5>
                    <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                      {coach.specialite || "Spécialité inconnue"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-blueGray-500">Aucun coach disponible pour le moment.</p>
          )}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/coachs"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25"
          >
            Voir plus
          </Link>
        </div>
      </div>
    </section>
  );
}