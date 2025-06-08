import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function MesFactures() {
  const [factures, setFactures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Récupérer l'ID de l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  
  useEffect(() => {
    const fetchFactures = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Récupérer toutes les factures
        const response = await axios.get("http://localhost:5000/facture/getAllFactures");
        const allFactures = response.data.factures || [];
        
        // Filtrer les factures de l'utilisateur connecté
        const userFactures = allFactures.filter(facture => facture.client === userId);
        
        setFactures(userFactures);
      } catch (error) {
        console.error("Erreur lors du chargement des factures:", error);
        setError("Impossible de charger vos factures. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFactures();
  }, [userId]);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr });
    } catch (error) {
      return "Date invalide";
    }
  };
  
  const getStatusBadgeClass = (statut) => {
    switch (statut?.toLowerCase()) {
      case "payée":
        return "bg-green-100 text-green-800";
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "annulée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Chargement de vos factures...</p>
      </div>
    );
  }
  
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Mes Factures</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {factures.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <p className="text-gray-500">Vous n'avez aucune facture pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {factures.map((facture) => (
            <div key={facture._id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Facture #{facture._id.slice(-6)}</h2>
                  <p className="text-gray-600">{formatDate(facture.date)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(facture.statut)}`}>
                  {facture.statut}
                </span>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-bold">{facture.montant} DT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode de paiement:</span>
                  <span>{facture.methode}</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800">
                  Télécharger PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}