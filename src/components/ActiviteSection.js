import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ActiviteSection() {
  const [activites, setActivites] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios
      .get("http://localhost:5000/Activite/getAllActivites")
      .then((res) => {
        if (res.data && res.data.Activites) {
          setActivites(res.data.Activites.slice(0, 3));
        }
      })
      .catch((err) => console.error("Erreur lors du chargement des activités :", err));
  }, []);
  
  return (
    <section className="pb-20 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Nos <span className="text-yellow-400">Activités</span>
          </h2>
          <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
            Découvrez les principales activités que nous proposons chez GymManager.
          </p>
        </div>
        <div className="flex flex-wrap text-center justify-center">
          {activites.map((item) => (
            <div key={item._id} className="w-full md:w-4/12 px-4 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 border border-gray-700/50 hover:border-yellow-400/50 hover:bg-gray-800/70">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={item.image ? `http://localhost:5000${item.image}` : "/placeholder-activity.jpg"}
                    alt={item.nom}
                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h6 className="text-xl font-bold mb-2 text-white">{item.nom}</h6>
                <p className="text-gray-300 mb-4">{item.description}</p>
                <button
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-2 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25"
                  onClick={() => navigate(`/activite/${item._id}`)}
                >
                  Voir les Détails
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Bouton "Voir plus" ajouté ici */}
        <div className="text-center mt-8">
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25"
            onClick={() => navigate("/activites")}
          >
            Voir plus
          </button>
        </div>
      </div>
    </section>
  );
}