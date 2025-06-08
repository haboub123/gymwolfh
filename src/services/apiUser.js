import axios from "axios";

const API_URL = "http://localhost:5000";

// Configure axios defaults
axios.defaults.withCredentials = true;

// Helper function for error handling
const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || defaultMessage);
};

// ✅ Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addUserClient`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Registration failed.");
  }
};

// ✅ Login (with token handling)
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, loginData);
    const { user, token } = response.data; // On s'assure que le token est bien retourné
    return { user, token };
  } catch (error) {
    handleApiError(error, "Login failed.");
  }
};

// ✅ Get All Coaches (using the correct endpoint)
export const getAllCoaches = async () => {
  try {
    const token = localStorage.getItem("jwt_token_9antra");
    const response = await axios.get(`${API_URL}/users/coachs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch coaches.");
  }
};

// ✅ Get All Users
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("jwt_token_9antra");
    const response = await axios.get(`${API_URL}/users/getAllUsers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch users.");
  }
};

// ✅ Delete Coach by ID
export const deleteCoachById = async (id) => {
  try {
    const token = localStorage.getItem("jwt_token_9antra");
    const response = await axios.delete(`${API_URL}/users/deleteUserById/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete coach.");
  }
};

// ✅ Delete User by ID
export const deleteUserById = async (id) => {
  try {
    const token = localStorage.getItem("jwt_token_9antra");
    const response = await axios.delete(`${API_URL}/users/deleteUserById/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete user.");
  }
};

// ✅ Update User by ID
export const updateUserById = async (id, updatedData) => {
  try {
    const token = localStorage.getItem("jwt_token_9antra");
    const response = await axios.put(`${API_URL}/users/updateUserById/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update user.");
  }
};

// ✅ Add Coach
export const addUserCoach = async (coachData) => {
  try {
    const token = localStorage.getItem("jwt_token_9antra");
    const response = await axios.post(`${API_URL}/users/addUserCoach`, coachData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to add coach.");
  }
};

// ✅ Add Coach with Image
export const addCoachWithImage = async (formData) => {
  try {
    const token = localStorage.getItem("jwt_token_9antra");
    const response = await axios.post(`${API_URL}/users/addCoachWithImg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to add coach with image.");
  }
};

// ✅ Add Client
export const addUserClient = async (clientData) => {
  try {
    const token = localStorage.getItem("jwt_token_9antra");
    const response = await axios.post(`${API_URL}/users/addUserClient`, clientData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to add client.");
  }
};

// ✅ Helper function for coach image URL (Updated)
export const getCoachImageUrl = (imagePath, defaultImage = "https://via.placeholder.com/150") => {
  return imagePath ? `${API_URL}/uploads/${imagePath}` : defaultImage;
};