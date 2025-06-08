import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import ActiviteSection from "./ActiviteSection";
import CoachSection from "./CoachSection";
import AvisSection from "./AvisSection";
// import ProfileModal from "./ProfileModal"; // Importer le nouveau composant

export default function LandingFitness() {
  const [user, setUser] = useState(null);
  // const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // État pour le modal

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fonction pour mettre à jour l'utilisateur
  /* const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  }; */

  return (
    <>
      <main>
        {/* Section Hero - Différente selon l'état de connexion */}
        {user && user.role =="client"  ? (
          // Design pour utilisateur connecté
          <div
            className="relative pt-24 pb-32 flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1350&q=80')",
            }}
          >
            <span className="absolute w-full h-full bg-black opacity-80"></span>
            
            {/* Éléments décoratifs */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
            </div>
            
            {/* BOUTON DE PROFIL - Cercle blanc en haut à droite */}
            

            <div className="relative container mx-auto text-center z-10">
              <div className="text-white px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg mb-6">
                  Bienvenue, <span className="text-yellow-400">{user.username}</span> !
                </h1>
                <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  Prêt à booster votre entraînement ? Explorez vos abonnements et réservations dès maintenant.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Link
                    to="/mes-abonnements"
                    className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-4 px-10 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-yellow-400/25"
                  >
                    Mes Abonnements
                  </Link>
                  <Link
                    to="/mes-reservations"
                    className="inline-block bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-4 px-10 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-blue-400/25"
                  >
                    Mes Réservations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Design pour visiteur non connecté (comme dans capture 1)
          <div
            className="relative pt-24 pb-32 flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1470&q=80')",
            }}
          >
            <span className="absolute w-full h-full bg-black opacity-80"></span>
            {/* Éléments décoratifs */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
            </div>
            <div className="relative container mx-auto text-center z-10">
              <div className="text-white px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg mb-6">
                  Libérez Votre <span className="text-yellow-400">Puissance</span><br />
                  Intérieure
                </h1>
                <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  Rejoignez <strong className="text-yellow-400">Gym Wolf</strong> et découvrez un coaching d'élite, des programmes intelligents et une communauté inspirante. Votre transformation commence maintenant.
                </p>
                <Link
                  to="/auth/login"
                  className="mt-8 inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-4 px-10 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-yellow-400/25"
                >
                  Lancez-Vous Dès Aujourd'hui
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Section Services - Identique pour les deux cas */}
        <section className="pb-20 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 -mt-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-40 left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-wrap text-center">
              {[
                {
                  icon: "fas fa-dumbbell",
                  title: "Équipements de Pointe",
                  text: "Entraînez-vous avec des machines modernes et performantes pour des résultats optimaux.",
                  color: "bg-gradient-to-r from-yellow-400 to-yellow-500",
                },
                {
                  icon: "fas fa-user-check",
                  title: "Coachs d'Exception",
                  text: "Nos experts certifiés vous accompagnent avec passion et expertise.",
                  color: "bg-gradient-to-r from-blue-400 to-blue-500",
                },
                {
                  icon: "fas fa-clipboard-list",
                  title: "Programmes Sur-Mesure",
                  text: "Des entraînements conçus pour vos objectifs, votre niveau et votre rythme de vie.",
                  color: "bg-gradient-to-r from-emerald-400 to-emerald-500",
                },
              ].map((item, i) => (
                <div key={i} className="w-full md:w-4/12 px-4 mb-10">
                  <div className="bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-8 hover:scale-105 transition-all duration-300 border border-gray-700/50 hover:border-yellow-400/50 hover:bg-gray-800/70">
                    <div
                      className={`text-white w-16 h-16 mb-6 mx-auto rounded-full flex items-center justify-center ${item.color} shadow-lg`}
                    >
                      <i className={`${item.icon} text-2xl`}></i>
                    </div>
                    <h6 className="text-xl font-bold mb-3 text-white">{item.title}</h6>
                    <p className="text-gray-300 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section À Propos */}
        <section className="relative py-20 bg-gradient-to-br from-gray-800 via-slate-700 to-gray-800 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-wrap items-center">
              <div className="w-full md:w-5/12 ml-auto px-4">
                <h3 className="text-3xl md:text-4xl font-bold text-white">Pourquoi Rejoindre <span className="text-yellow-400">Gym Wolf</span> ?</h3>
                <p className="mt-4 text-lg leading-relaxed text-gray-300">
                  Que vous visiez la puissance, l'endurance ou la souplesse, Gym Wolf est bien plus qu'une salle de sport — c'est votre partenaire de transformation.
                </p>
                <ul className="mt-6 space-y-3 text-gray-300">
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Abonnements flexibles et adaptés</li>
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Accompagnement nutritionnel complet</li>
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Séances collectives motivantes</li>
                </ul>
              </div>
              <div className="w-full md:w-5/12 px-4 mr-auto">
                <img
                  className="rounded-lg shadow-2xl transform hover:scale-105 transition duration-300"
                  src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1350&q=80"
                  alt="fitness"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section Activités */}
        <ActiviteSection />

        {/* Section Coachs */}
        <CoachSection />

        {/* Section Avis */}
        <AvisSection />

        {/* Footer */}
        <Footer />
      </main>

      {/* Modal de modification de profil */}
      
    </>
  );
}