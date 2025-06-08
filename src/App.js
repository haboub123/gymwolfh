import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./components/dashboards/admin/AdminDashboard";
import CoachDashboard from "./components/dashboards/coach/CoachDashboard";
import ClientDashboard from "./components/dashboards/clients";
import ManageCoachPage from "./components/dashboards/admin/ManageCoachPage";
import ManageClientPage from "./components/dashboards/admin/ManageClientPage";
import ManageActivitéPage from "./components/dashboards/admin/ManageActivitéPage";
import ManageSeancePage from "./components/dashboards/admin/ManageSeancePage";
import ManageSallePage from "./components/dashboards/admin/ManageSallePage";
import ManageAbonnementPage from "./components/dashboards/admin/ManageAbonnementPage";
import ManageAffectationPage from "./components/dashboards/admin/ManageAffectationPage";
import ManageAvisPage from "./components/dashboards/admin/ManageAvisPage";
import NotificationsPage from "./components/NotificationsPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/ResetPassword"; // Ajout de l'import

import HomePage from "./components/HomePage";
import SeancesByActivite from "./components/SeancesByActivite";
import AllActivitesPage from "./components/AllActivitesPage";
import CoachsPage from "./components/CoachsPage";
import CoachProfile from "./components/CoachProfile";
import AbonnementList from "./components/AbonnementList";
import MesAbonnements from "./components/MesAbonnements";
import MesFactures from "./components/MesFactures";
import MesReservations from "./components/MesReservations";
import Facturation from "./components/Facturation";

import "./App.css";

const ProtectedRoute = ({ children, requiredRole }) => {
  const userString = localStorage.getItem("user");

  if (!userString) {
    return <Navigate to="/auth/login" />;
  }

  try {
    const user = JSON.parse(userString);

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === "admin") {
        return <Navigate to="/dashboard/admin" />;
      } else if (user.role === "coach") {
        return <Navigate to="/dashboard/coach" />;
      } else {
        return <Navigate to="/" />;
      }
    }

    return children;
  } catch (error) {
    console.error("Erreur lors de l'analyse des données utilisateur :", error);
    localStorage.removeItem("user");
    return <Navigate to="/auth/login" />;
  }
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forget" element={<ForgotPassword />} />
         <Route path="/reset-password/:token" element={<ResetPassword />} />{/* Ajout de la route */}

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-avis"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageAvisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-coach"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageCoachPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-client"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageClientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-activite"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageActivitéPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-seance"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageSeancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-salle"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageSallePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-abonnement"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageAbonnementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-affectation"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageAffectationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/coach"
            element={
              <ProtectedRoute requiredRole="coach">
                <CoachDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<HomePage />} />
          <Route path="/activite/:id" element={<SeancesByActivite />} />
          <Route path="/coachs" element={<CoachsPage />} />
          <Route path="/coach-profile/:id" element={<CoachProfile />} />
          <Route path="/abonnement" element={<AbonnementList />} />
          <Route path="/activites" element={<AllActivitesPage />} />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mes-abonnements"
            element={
              <ProtectedRoute>
                <MesAbonnements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-factures"
            element={
              <ProtectedRoute>
                <MesFactures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-reservations"
            element={
              <ProtectedRoute>
                <MesReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturation"
            element={
              <ProtectedRoute>
                <Facturation />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;