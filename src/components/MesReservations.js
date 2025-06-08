// MesReservations.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddAvis from "../components/AddAvis";

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const pendingReservation = sessionStorage.getItem("pendingReservation");
    if (pendingReservation) {
      handlePendingReservation(JSON.parse(pendingReservation));
    } else {
      fetchReservations();
    }
  }, []);

  const handlePendingReservation = async (reservationData) => {
    try {
      setNotification("Finalisation de votre réservation...");
      const response = await axios.post(
        "http://localhost:5000/Reservation/addReservation",
        reservationData,
        { withCredentials: true }
      );
      if (response.data && response.data.reservation) {
        await axios.put(
          "http://localhost:5000/Reservation/affect",
          { reservationId: response.data.reservation._id },
          { withCredentials: true }
        );
        sessionStorage.removeItem("pendingReservation");
        setNotification("Réservation créée avec succès!");
        fetchReservations();
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      setError("Erreur lors de la réservation: " + (error.response?.data?.message || error.message));
      setLoading(false);
      sessionStorage.removeItem("pendingReservation");
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/Reservation/getUserReservations",
        { withCredentials: true }
      );
      if (response.data && response.data.reservations) {
        setReservations(response.data.reservations);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      setError("Erreur lors de la récupération des réservations. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/Reservation/deleteReservationById/${id}`, { withCredentials: true });
      setReservations(reservations.filter((r) => r._id !== id));
      setNotification("Réservation annulée avec succès");
      setTimeout(() => setNotification(null), 3000);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      setError("Erreur lors de l'annulation. Veuillez réessayer.");
      setLoading(false);
    }
  };

  // Vérifier si la séance est terminée
  const isSeanceTerminee = (reservation) => {
    try {
      const seanceDateTime = new Date(`${new Date(reservation.date).toISOString().split('T')[0]}T${reservation.heure}`);
      const now = new Date();
      return seanceDateTime < now;
    } catch (error) {
      console.error("Erreur lors de la vérification de la date de la séance:", error);
      return false;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#1a202c'}}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-xl">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{backgroundColor: '#1a202c'}}>
      {/* Header avec effet glassmorphism */}
      <div className="relative overflow-hidden py-20" style={{backgroundColor: '#2d3748'}}>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Mes <span className="text-yellow-400">Réservations</span>
            </h2>
            <div className="flex justify-center items-center mt-6 space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">K</div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">Y</div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">Y</div>
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">+5</div>
              <span className="text-white ml-4">90K+ Satisfied Customer</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        {/* Notifications */}
        {notification && (
          <div className="mb-8 p-6 rounded-2xl" style={{backgroundColor: '#4a5568', border: '1px solid #2d3748'}}>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white font-medium text-lg">{notification}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-6 rounded-2xl" style={{backgroundColor: '#4a5568', border: '1px solid #2d3748'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white font-medium">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="text-white hover:text-red-200 font-bold text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-lg mx-auto p-8 rounded-3xl" style={{backgroundColor: '#2d3748', border: '1px solid #4a5568'}}>
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white text-xl mb-6">Vous n'avez pas encore de réservations.</p>
              <Link 
                to="/nos-activites" 
                className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Découvrir nos activités
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {reservations.map((reservation) => (
              <div 
                key={reservation._id} 
                className="group relative rounded-3xl p-8 hover:transform hover:scale-105 transition-all duration-300 shadow-2xl"
                style={{backgroundColor: '#2d3748', border: '1px solid #4a5568'}}
              >
                {/* Card Header avec gradient coloré */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 rounded-t-3xl"></div>
                
                <div className="relative">
                  {/* Titre de la séance */}
                  <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-yellow-400 transition-colors duration-300">
                    {reservation.nomSeance}
                  </h3>

                  {/* Informations de la réservation */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-300">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="font-semibold text-white">{new Date(reservation.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Heure</p>
                        <p className="font-semibold text-white">{reservation.heure}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'annulation */}
                  <button
                    onClick={() => cancelReservation(reservation._id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        En cours...
                      </div>
                    ) : (
                      "Annuler la réservation"
                    )}
                  </button>

                  {/* Section avis */}
                  {isSeanceTerminee(reservation) ? (
                    <AddAvis seanceId={reservation.seance} reservationId={reservation._id} />
                  ) : (
                    <div className="p-4 rounded-xl" style={{backgroundColor: '#4a5568', border: '1px solid #2d3748'}}>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        Vous pourrez laisser un avis après la séance ({new Date(reservation.date).toLocaleDateString()} à {reservation.heure}).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}