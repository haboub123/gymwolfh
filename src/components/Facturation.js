import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Facturation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [abonnement, setAbonnement] = useState(null);
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const methodesPaiement = ["Carte bancaire", "Espèces", "Virement bancaire"];
  const [methodePaiement, setMethodePaiement] = useState("Carte bancaire");

  useEffect(() => {
    const abonnementData = JSON.parse(localStorage.getItem("abonnementEnCours"));

    if (!abonnementData) {
      navigate("/abonnement");
      return;
    }

    setAbonnement(abonnementData);

    if (!userId) {
      setError("Vous devez être connecté pour finaliser votre achat");
    }
  }, [navigate, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!userId) {
        throw new Error("Vous devez être connecté pour finaliser votre achat");
      }

      if (!abonnement) {
        throw new Error("Aucun abonnement sélectionné");
      }

      const factureResponse = await axios.post("http://localhost:5000/Facture/addFacture", {
        montant: abonnement.prix,
        date: new Date(),
        methode: methodePaiement,
        statut: "Payée"
      });

      if (!factureResponse.data || !factureResponse.data.facture) {
        throw new Error("Erreur lors de la création de la facture");
      }

      const factureId = factureResponse.data.facture._id;

      await axios.put("http://localhost:5000/Facture/affect", {
        userId: userId,
        factureId: factureId
      });

      await axios.put("http://localhost:5000/Abonnement/affect", {
        userId: userId,
        abonnementId: abonnement._id
      });

      setSuccess("Votre achat a été effectué avec succès. Vous allez être redirigé vers vos abonnements.");

      localStorage.removeItem("abonnementEnCours");

      setTimeout(() => {
        navigate("/mes-abonnements");
      }, 2000);

    } catch (error) {
      console.error("Erreur lors de la facturation:", error);
      setError(error.response?.data?.message || error.message || "Une erreur s'est produite lors de la facturation");
    } finally {
      setIsLoading(false);
    }
  };

  if (!abonnement) {
    return <div className="p-8 text-center text-white">Chargement...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">Finaliser votre achat</h1>

      {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded mb-4">{success}</div>}

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Détails de l'abonnement</h2>
        <div className="border-b border-gray-700 pb-4 mb-4">
          <p className="flex justify-between">
            <span>Type d'abonnement:</span>
            <span className="font-medium">{abonnement.type}</span>
          </p>
          <p className="flex justify-between">
            <span>Durée:</span>
            <span className="font-medium">{abonnement.duree} mois</span>
          </p>
          <p className="flex justify-between">
            <span>Montant:</span>
            <span className="font-bold text-yellow-400">{abonnement.prix} DT</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Méthode de paiement</label>
            <select
              className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
              value={methodePaiement}
              onChange={(e) => setMethodePaiement(e.target.value)}
              disabled={isLoading}
            >
              {methodesPaiement.map((methode) => (
                <option key={methode} value={methode} className="text-gray-900">{methode}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-medium hover:bg-yellow-500 transition"
            disabled={isLoading}
          >
            {isLoading ? "Traitement en cours..." : "Confirmer et payer"}
          </button>
        </form>
      </div>
    </div>
  );
}