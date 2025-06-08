import React, { useState, useEffect } from "react";

const AddAvis = ({ seanceId, reservationId }) => {
  const [note, setNote] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Labels pour les notes
  const ratingLabels = {
    1: "Très faible",
    2: "Faible", 
    3: "Correct",
    4: "Bien",
    5: "Excellent"
  };

  const ratingDescriptions = {
    1: "Séance très décevante",
    2: "Séance décevante",
    3: "Séance satisfaisante", 
    4: "Bonne séance",
    5: "Séance excellente"
  };

  const ratingColors = {
    1: "text-red-600",
    2: "text-orange-500",
    3: "text-yellow-500",
    4: "text-green-500",
    5: "text-green-600"
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setMessage("Vous devez être connecté pour laisser un avis");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsAuthenticated(false);
        setMessage("Erreur lors de la vérification de l'authentification");
      }
    };
    checkAuth();
  }, []);

  const handleRatingClick = (newRating) => {
    setNote(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!isAuthenticated || !user || !user._id) {
      setMessage("Vous devez être connecté pour laisser un avis");
      setIsSubmitting(false);
      return;
    }

    if (user.role !== "client") {
      setMessage("Seuls les clients peuvent laisser un avis");
      setIsSubmitting(false);
      return;
    }

    if (note === 0) {
      setMessage("Veuillez sélectionner une note");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Données envoyées à /avis/addAvis :", { note, commentaire, date: new Date() });
      const avisResponse = await fetch("http://localhost:5000/avis/addAvis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ note, commentaire, date: new Date().toISOString() })
      });
      const avisData = await avisResponse.json();
      console.log("Réponse de /avis/addAvis :", avisData);

      const avisId = avisData.avis._id;
      console.log("avisId récupéré :", avisId);

      console.log("Données envoyées à /avis/affect :", { userId: user._id, avisId, seanceId });
      const affectResponse = await fetch("http://localhost:5000/avis/affect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: user._id, avisId, seanceId })
      });
      const affectData = await affectResponse.json();
      console.log("Réponse de /avis/affect :", affectData);

      const seanceResponse = await fetch(`http://localhost:5000/Seance/getSeanceById/${seanceId}`, {
        credentials: "include"
      });
      const seanceData = await seanceResponse.json();
      const coachIds = seanceData.seance.coachs;

      await fetch("http://localhost:5000/notification/addNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          contenu: `Nouvel avis laissé par ${user.username} pour la séance ${seanceData.seance.titre}`,
          roleCible: "admin",
          clients: [],
        })
      });

      await fetch("http://localhost:5000/notification/addNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          contenu: `Nouvel avis laissé par ${user.username} pour votre séance ${seanceData.seance.titre}`,
          roleCible: "coach",
          clients: coachIds,
        })
      });

      setMessage("Avis ajouté avec succès ! Une notification a été envoyée.");
      setNote(0);
      setCommentaire("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Erreur détaillée :", error);
      setMessage("Erreur lors de l'ajout de l'avis. Veuillez vous reconnecter et réessayer.");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRating = hoveredRating || note;

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">Évaluez votre séance</h4>
      
      {isAuthenticated ? (
        <div className="space-y-6">
          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-700 mb-1">
              <strong>Comment noter votre séance ?</strong>
            </p>
            <p className="text-xs text-blue-600">
              Cliquez sur les étoiles : 1 = Très faible • 2 = Faible • 3 = Correct • 4 = Bien • 5 = Excellent
            </p>
          </div>

          <div onSubmit={handleSubmit} className="space-y-4">
            {/* Système d'étoiles */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Votre note :
              </label>
              
              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= currentRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } transition-colors duration-200`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Affichage de la note actuelle */}
              {currentRating > 0 && (
                <div className="mb-4">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 ${ratingColors[currentRating]}`}>
                    <span className="mr-2">{currentRating}/5</span>
                    <span className="font-bold">{ratingLabels[currentRating]}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {ratingDescriptions[currentRating]}
                  </p>
                </div>
              )}
            </div>

            {/* Guide de notation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 mb-2 text-center">
                Guide de notation :
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                {Object.entries(ratingLabels).map(([noteValue, label]) => (
                  <div key={noteValue} className="text-center p-2 bg-white rounded border">
                    <div className="font-bold text-gray-800">{noteValue} ⭐</div>
                    <div className={`font-semibold ${ratingColors[noteValue]}`}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire :
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="4"
                placeholder="Partagez vos impressions sur cette séance... (obligatoire)"
                required
              />
            </div>

            {/* Bouton de soumission */}
            <button
              onClick={handleSubmit}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                note === 0 || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={note === 0 || isSubmitting}
            >
              {isSubmitting 
                ? "Envoi en cours..." 
                : note === 0 
                ? "Veuillez sélectionner une note"
                : `Soumettre mon avis (${note}/5 - ${ratingLabels[note]})`
              }
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-700 font-medium">
            Veuillez vous connecter pour laisser un avis.
          </p>
        </div>
      )}
      
      {/* Messages */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg border-l-4 ${
          message.includes("succès") 
            ? "bg-green-50 text-green-800 border-green-400" 
            : "bg-red-50 text-red-800 border-red-400"
        }`}>
          <div className="flex items-center">
            {message.includes("succès") ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAvis;