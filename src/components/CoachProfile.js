import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CoachProfile = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const coachResponse = await axios.get(`http://localhost:5000/users/getUserById/${id}`);
        setCoach(coachResponse.data.user);

        const avisResponse = await axios.get(`http://localhost:5000/avis/getAvisByCoach/${id}`);
        setAvis(avisResponse.data.avisListe);

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du profil du coach", err);
        setError("Impossible de charger le profil du coach.");
        setLoading(false);
      }
    };

    fetchCoach();
  }, [id]);

  if (loading) return <p className="text-center">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!coach) return <p className="text-center">Aucun coach trouvé.</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">
        Profil de {coach.username}
      </h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        {coach.user_image && (
          <img
            src={`/uploads/${coach.user_image}`}
            alt={`${coach.username} profile`}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}
        <p className="text-gray-600">
          <strong>Email :</strong> {coach.email}
        </p>
        <p className="text-gray-600">
          <strong>Spécialité :</strong> {coach.specialite || "Non précisée"}
        </p>
        <p className="text-gray-600">
          <strong>Rôle :</strong> {coach.role}
        </p>
        <p className="text-gray-600">
          <strong>Âge :</strong> {coach.age || "Non spécifié"} ans
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Avis des Clients</h2>
          {avis && avis.length > 0 ? (
            avis.map((avisItem, index) => (
              <div key={index} className="border-b py-2">
                <p className="text-gray-600">
                  <strong>Note :</strong> {avisItem.note}/5
                </p>
                <p className="text-gray-600">
                  <strong>Commentaire :</strong> {avisItem.commentaire}
                </p>
                <p className="text-gray-500 text-sm">
                  Par {avisItem.client?.username || "Utilisateur anonyme"} le{" "}
                  {new Date(avisItem.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Aucun avis pour cet entraîneur.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachProfile;