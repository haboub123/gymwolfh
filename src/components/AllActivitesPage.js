import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function AllActivitesPage() {
  const [activites, setActivites] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Activite/getAllActivites")
      .then((res) => {
        if (res.data && res.data.Activites) {
          setActivites(res.data.Activites);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des activités :", err);
      });
  }, []);

  return (
    <>
      <Navbar />
      <section className="py-20 bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-white">Nos Activités</h2>
            <p className="mt-4 text-gray-300">
              Voici toutes les activités proposées par <span className="text-yellow-400 font-semibold">Gym Wolf</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activites.map((item) => (
              <div key={item._id} className="bg-gray-800 shadow rounded overflow-hidden hover:shadow-xl transition">
                {/* Image de l'activité */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image ? `http://localhost:5000${item.image}` : "/placeholder-activity.jpg"}
                    alt={item.nom}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{item.nom}</h3>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  <Link
                    to={`/activite/${item._id}`}
                    className="text-yellow-400 font-medium hover:underline"
                  >
                    Voir les séances →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}