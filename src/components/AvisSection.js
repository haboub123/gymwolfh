import React, { useState, useEffect } from "react";

const AvisSection = () => {
  const [avisListe, setAvisListe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        // Remplacez cette section par votre appel API avec axios
        const response = await fetch("http://localhost:5000/avis/getSharedAvis");
        const data = await response.json();
        console.log("Données reçues dans AvisSection :", data.avisListe);
        setAvisListe(data.avisListe || []);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        setLoading(false);
      }
    };
    fetchAvis();
  }, []);

  const nextSlide = () => {
    if (avisListe.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % avisListe.length);
    }
  };

  const prevSlide = () => {
    if (avisListe.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + avisListe.length) % avisListe.length);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-yellow-400 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-40 bg-gray-700 rounded w-full max-w-2xl mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (avisListe.length === 0) {
    return (
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Que Disent Nos Membres<br />
            À Propos de <span className="text-yellow-400">Nous?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">Plus de 10 000 Clients Satisfaits</p>
          <p className="text-xl text-gray-400">Aucun avis disponible pour le moment.</p>
        </div>
      </section>
    );
  }

  const currentAvis = avisListe[currentIndex];

  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-8xl font-bold text-yellow-400 rotate-12">testimonial</div>
        <div className="absolute bottom-20 right-10 text-6xl font-bold text-yellow-400 -rotate-12">gym wolf</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-yellow-500">★</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Section gauche - Titre et statistiques */}
          <div className="text-left">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
              Que Disent Nos Membres<br />
              À Propos de <span className="text-yellow-400">Nous?</span>
            </h2>
            
            {/* Avatars clients satisfaits */}
            <div className="flex items-center mb-6">
              <div className="flex -space-x-3">
                {avisListe.slice(0, 4).map((avis, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-semibold border-2 border-yellow-500 shadow-lg"
                  >
                    {avis.client?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                ))}
                {avisListe.length > 4 && (
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400 text-sm font-semibold border-2 border-yellow-400 shadow-lg">
                    +{avisListe.length - 4}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300 font-medium">{avisListe.length}0K+ Satisfied Customer</p>
              </div>
            </div>
          </div>

          {/* Section droite - Avis avec carrousel */}
          <div className="relative">
            {/* Carte d'avis principale */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 relative">
              {/* Étoiles */}
              <div className="flex items-center justify-end mb-6">
                {Array(5).fill().map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < currentAvis.note ? "text-yellow-400" : "text-gray-500"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Commentaire */}
              <blockquote className="text-lg lg:text-xl text-gray-100 mb-8 leading-relaxed">
                "{currentAvis.commentaire}"
              </blockquote>

              {/* Informations client */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black text-xl font-bold mr-4 shadow-lg">
                  {currentAvis.client?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">
                    {currentAvis.client?.username || "Utilisateur inconnu"}
                  </div>
                  <div className="text-yellow-400 text-sm">Client</div>
                </div>
              </div>

              {/* Informations séance */}
              <div className="border-t border-gray-600 pt-4 space-y-2">
                <p className="text-lg font-medium text-yellow-400">
                  Activité : {currentAvis.seance?.activite?.nom || "Activité non spécifiée"}
                </p>
                <p className="text-sm text-gray-300">
                  Séance : {currentAvis.seance?.titre || "Séance non spécifiée"}
                </p>
                <p className="text-sm text-gray-300">
                  Coach(s) : {" "}
                  {currentAvis.seance?.coachs?.length > 0
                    ? currentAvis.seance.coachs.map((coach) => coach.username).join(", ")
                    : "Coach non spécifié"}
                </p>
              </div>
            </div>

            {/* Contrôles de navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-gray-700 border border-yellow-400 flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 shadow-lg"
                disabled={avisListe.length <= 1}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Indicateurs de pagination */}
              <div className="flex space-x-2">
                {avisListe.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "bg-yellow-400 w-8" 
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-gray-700 border border-yellow-400 flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 shadow-lg"
                disabled={avisListe.length <= 1}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques en bas - SUPPRIMÉ */}
      </div>
    </section>
  );
};

export default AvisSection;