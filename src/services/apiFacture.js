import axios from "axios";

const API_URL = "http://localhost:5000";

// Créer une nouvelle facture
export const createFacture = async (factureData) => {
  try {
    const response = await axios.post(`${API_URL}/facture/addFacture`, factureData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Create Facture Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create invoice.");
  }
};

// Récupérer toutes les factures
export const getAllFactures = async () => {
  try {
    const response = await axios.get(`${API_URL}/facture/getAllFactures`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get Factures Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch invoices.");
  }
};

// Récupérer une facture par ID
export const getFactureById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/facture/getFactureById/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get Facture Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch invoice.");
  }
};

// Mettre à jour une facture
export const updateFacture = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/facture/updateFacture/${id}`, updatedData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Update Facture Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update invoice.");
  }
};

// Supprimer une facture
export const deleteFactureById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/facture/deleteFactureById/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete Facture Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete invoice.");
  }
};

// Affecter une facture à un utilisateur
export const affectFactureToUser = async (userId, factureId) => {
  try {
    const response = await axios.put(`${API_URL}/facture/affect`, {
      userId,
      factureId
    }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Affect Facture Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to assign invoice to user.");
  }
};