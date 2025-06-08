import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendar, FaClock, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
      
const user = JSON.parse(localStorage.getItem("user"));

// Consistent token handling
const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt_token_9antra="))
    ?.split("=")[1];
};

// Formatage des dates
const formatDate = (date) => {
  return new Date(date).toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Formatage des heures
const formatTime = (time) => {
  return time ? new Date(`1970-01-01T${time}`).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }) : "N/A";
};

// Composant principal
const SeancesByActivite = () => {
  const { id } = useParams();
  const [activite, setActivite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Charger les détails de l'activité
  useEffect(() => {
    axios
      .get(`http://localhost:5000/Activite/getActiviteById/${id}`)
      .then((res) => {
        if (res.data && res.data.Activite) {
          setActivite(res.data.Activite);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Erreur lors du chargement de l'activité");
        setLoading(false);
      });
  }, [id]);

  // Gérer la réservation
  const handleReservation = (seanceId, nomSeance, date, heure) => {
    const token = getAuthToken();

    if (!user) {
      sessionStorage.setItem( 
        "pendingReservation",
        JSON.stringify({ seance: seanceId, nomSeance, date, heure })
      );
      navigate("/auth/login");
    } else {
      processReservation(seanceId, nomSeance, date, heure);
    }
  };

  // Traiter la réservation
  const processReservation = async (seanceId, nomSeance, date, heure) => {
  try {
    console.log("ProcessReservation: ", seanceId, nomSeance, date, heure)
    setLoading(true);

    // 1. Ajouter la réservation
    const reservationResponse = await axios.post(
      "http://localhost:5000/Reservation/addReservation",
      { seance: seanceId, nomSeance, date, heure },
      { withCredentials: true }
    );

    if (!reservationResponse.data.reservation) {
      throw new Error("Échec de la création de la réservation");
    }

    const reservationId = reservationResponse.data.reservation._id;

    // 2. Affecter la réservation au client connecté
    await axios.put(
      "http://localhost:5000/Reservation/affect",
      { reservationId },
      { withCredentials: true }
    );
    // 3. Récupérer la séance pour trouver les coachs
    const seanceResponse = await axios.get(
      `http://localhost:5000/Seance/getSeanceById/${seanceId}`
    );
    const seance = seanceResponse.data.seance;
    const coachIds = seance.coachs;

    // 4. Envoyer une notification aux coachs
    await axios.post(
      "http://localhost:5000/notification/addNotification",
      {
        contenu: `Nouvelle réservation pour la séance "${nomSeance}" le ${formatDate(date)} à ${formatTime(heure)}`,
        roleCible: "coach",
        clients: coachIds,
      },
      { withCredentials: true }
    );
    console.log(localStorage.getItem("user"));

    // 5. Navigation immédiate vers "mes réservations"
    navigate("/mes-reservations");

  } catch (error) {
    console.error("Erreur lors de la réservation :", error);
    setError(
      "Erreur lors de la réservation : " +
      (error.response?.data?.message || error.message)
    );
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 border-solid mx-auto"></div>
          <p className="mt-4 text-white text-lg">Chargement des séances...</p>
        </div>
      </div>
    );
  }

  if (!activite) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-2xl font-semibold text-white">Activité non trouvée</p>
          <Link
            to="/nos-activites"
            className="mt-4 inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-500 font-medium"
          >
            <FaArrowLeft /> Retour aux activités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl bg-gray-900 min-h-screen">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8">
        <Link
          to="/nos-activites"
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-500 font-medium mb-6 transition-colors"
          aria-label="Retour à la liste des activités"
        >
          <FaArrowLeft /> Retour aux activités
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 bg-yellow-400/20 rounded-full flex items-center justify-center">
              <FaCalendar className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white">{activite.nom}</h2>
            <p className="mt-2 text-gray-400 text-lg">{activite.description}</p>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className="flex items-center gap-2 bg-green-900/20 text-green-400 px-4 py-3 rounded-lg mb-6 animate-fade-in"
          role="alert"
        >
          <FaCheckCircle className="h-5 w-5" />
          <span>{notification}</span>
        </div>
      )}
      {error && (
        <div
          className="flex items-center gap-2 bg-red-900/20 text-red-400 px-4 py-3 rounded-lg mb-6 animate-fade-in"
          role="alert"
        >
          <FaTimesCircle className="h-5 w-5" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-500 font-bold"
            aria-label="Fermer l'erreur"
          >
            ×
          </button>
        </div>
      )}

      <h3 className="text-2xl font-semibold text-white mb-6">Séances disponibles</h3>
      {activite.seances && activite.seances.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activite.seances.map((seance) => (
            <div
              key={seance._id}
              className="bg-gray-800 shadow-md rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              role="region"
              aria-label={`Séance ${seance.titre}`}
            >
              <h4 className="text-xl font-bold text-white mb-3">{seance.titre}</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <FaCalendar className="h-4 w-4 text-yellow-400" />
                  <span>
                    <strong>Date :</strong> {formatDate(seance.date)}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="h-4 w-4 text-yellow-400" />
                  <span>
                    <strong>Heure :</strong> {formatTime(seance.heure)}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FaHourglassHalf className="h-4 w-4 text-yellow-400" />
                  <span>
                    <strong>Durée :</strong> {seance.duree} min
                  </span>
                </p>
                <p>
                  <strong>Description :</strong> {seance.description}
                </p>
              </div>
              <button
                onClick={() =>
                  handleReservation(seance._id, seance.titre, seance.date, seance.heure)
                }
                className={`mt-4 w-full flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg hover:bg-yellow-500 transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
                aria-label={`Réserver la séance ${seance.titre}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-gray-900"></div>
                    En cours...
                  </>
                ) : (
                  <>
                    <FaCalendar className="h-4 w-4" />
                    Réserver
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-400">Aucune séance associée à cette activité.</p>
          <Link
            to="/nos-activites"
            className="mt-4 inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-500 font-medium"
          >
            <FaArrowLeft /> Voir d'autres activités
          </Link>
        </div>
      )}
    </div>
  );
};

export default SeancesByActivite;