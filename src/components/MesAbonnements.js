import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importation de la Navbar
import Navbar from "../components/navbar/Navbar"; // Adapte ce chemin selon ton projet

const user = JSON.parse(localStorage.getItem("user"));

export default function AbonnementListe() {
  const [abonnements, setAbonnements] = useState([]);
  const [userAbonnements, setUserAbonnements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allAbosResponse = await axios.get("http://localhost:5000/Abonnement/getAllAbonnement");
        const allAbos = allAbosResponse.data.abonnementListe || [];
        setAbonnements(allAbos);

        if (isLoggedIn && user._id) {
          try {
            const userAbosResponse = await axios.get(`http://localhost:5000/users/getUserAbonnements/${user._id}`);
            const userAbos = userAbosResponse.data.abonnements || [];
            setUserAbonnements(userAbos);
          } catch (userAbosError) {
            console.error("Erreur lors du chargement des abonnements de l'utilisateur:", userAbosError);
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des abonnements:", err);
        setError("Impossible de charger les abonnements. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, user]);

  const handleAchat = (abonnement) => {
    if (!isLoggedIn) {
      localStorage.setItem("abonnementEnCours", JSON.stringify(abonnement));
      navigate("/auth/login");
    } else {
      localStorage.setItem("abonnementEnCours", JSON.stringify(abonnement));
      navigate("/facturation");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const isAbonnementActif = (dateDebut, duree) => {
    const debut = new Date(dateDebut);
    const fin = new Date(debut);
    fin.setDate(fin.getDate() + duree);
    return fin > new Date();
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center bg-gray-900">
          <p className="text-lg text-yellow-400">Chargement des abonnements...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white mb-4">Nos Abonnements</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez nos formules d'abonnement adaptées à vos besoins et objectifs sportifs
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-8 max-w-3xl mx-auto">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {abonnements.map((abonnement) => (
              <div key={abonnement._id} className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-transform hover:scale-105 border border-yellow-500/20">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">{abonnement.type}</h2>
                    <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-bold">
                      {abonnement.duree} jours
                    </span>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Accès à toutes nos installations avec un abonnement {abonnement.type.toLowerCase()}.
                  </p>
                  <div className="mb-8">
                    <span className="text-3xl font-bold text-yellow-400">{abonnement.prix} DT</span>
                  </div>
                  <button
                    onClick={() => handleAchat(abonnement)}
                    className="w-full bg-yellow-500 text-black py-3 px-4 rounded-xl font-bold hover:bg-yellow-400 transition duration-300 shadow-lg hover:shadow-yellow-500/25"
                  >
                    Acheter cet abonnement
                  </button>
                </div>
              </div>
            ))}
          </div>

          {abonnements.length === 0 && !error && (
            <p className="text-center text-gray-400 text-lg">
              Aucun abonnement disponible pour le moment.
            </p>
          )}

          {isLoggedIn && (
            <div className="mt-16">
              <div className="text-center mb-12 border-t border-yellow-500/30 pt-16">
                <h2 className="text-4xl font-bold text-white mb-4">Mes Abonnements</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Voici la liste de vos abonnements actuels et passés
                </p>
              </div>

              {userAbonnements.length > 0 ? (
                <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-yellow-500/30">
                  {/* En-tête avec dégradé jaune et noir */}
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-6">
                    <h3 className="text-xl font-bold text-black">Historique des abonnements</h3>
                    <p className="text-black/80 mt-1 font-medium">Suivez l'état de tous vos abonnements</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-700 border-b border-yellow-500/30">
                        <tr>
                          <th className="px-8 py-5 text-left text-sm font-bold text-yellow-400 uppercase tracking-wider">
                            Type d'abonnement
                          </th>
                          <th className="px-8 py-5 text-left text-sm font-bold text-yellow-400 uppercase tracking-wider">
                            Date de début
                          </th>
                          <th className="px-8 py-5 text-left text-sm font-bold text-yellow-400 uppercase tracking-wider">
                            Date de fin
                          </th>
                          <th className="px-8 py-5 text-left text-sm font-bold text-yellow-400 uppercase tracking-wider">
                            Prix payé
                          </th>
                          <th className="px-8 py-5 text-left text-sm font-bold text-yellow-400 uppercase tracking-wider">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {userAbonnements.map((abonnement, index) => {
                          const dateDebut = new Date(abonnement.dateDebut);
                          const dateFin = new Date(dateDebut);
                          dateFin.setDate(dateFin.getDate() + abonnement.duree);
                          const actif = isAbonnementActif(abonnement.dateDebut, abonnement.duree);
                          
                          return (
                            <tr 
                              key={abonnement._id} 
                              className={`hover:bg-yellow-500/10 transition-all duration-300 ${
                                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                              }`}
                            >
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-yellow-500 mr-4"></div>
                                  <div>
                                    <div className="text-lg font-bold text-white capitalize">
                                      {abonnement.type}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Durée: {abonnement.duree} jours
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="text-base font-medium text-white">
                                  {formatDate(abonnement.dateDebut)}
                                </div>
                                <div className="text-sm text-gray-400">
                                  Début d'abonnement
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="text-base font-medium text-white">
                                  {formatDate(dateFin)}
                                </div>
                                <div className="text-sm text-gray-400">
                                  Fin d'abonnement
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="text-xl font-bold text-yellow-400">
                                  {abonnement.prix} DT
                                </div>
                                <div className="text-sm text-gray-400">
                                  Montant payé
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                                  actif 
                                    ? 'bg-yellow-500 text-black shadow-yellow-500/25' 
                                    : 'bg-gray-600 text-gray-300 shadow-gray-600/25'
                                }`}>
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    actif ? 'bg-black' : 'bg-gray-400'
                                  }`}></div>
                                  {actif ? 'Actif' : 'Expiré'}
                                </span>
                                {actif && (
                                  <div className="text-xs text-yellow-400 mt-1 font-medium">
                                    En cours d'utilisation
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pied de tableau avec statistiques */}
                  <div className="bg-gray-700 px-8 py-6 border-t border-yellow-500/30">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {userAbonnements.length}
                          </div>
                          <div className="text-sm text-gray-300">Total abonnements</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {userAbonnements.filter(abo => isAbonnementActif(abo.dateDebut, abo.duree)).length}
                          </div>
                          <div className="text-sm text-gray-300">Actifs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {userAbonnements.reduce((total, abo) => total + abo.prix, 0)} DT
                          </div>
                          <div className="text-sm text-gray-300">Total dépensé</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center bg-gray-800 p-12 rounded-3xl shadow-2xl border border-yellow-500/30">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Aucun abonnement trouvé</h3>
                  <p className="text-gray-300 text-lg mb-6">
                    Vous n'avez pas encore d'abonnements actifs ou expirés.
                  </p>
                  <p className="text-gray-400 mb-8">
                    Choisissez un abonnement ci-dessus pour commencer votre expérience fitness et profiter de nos installations.
                  </p>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:-translate-y-1"
                  >
                    Voir nos abonnements
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}