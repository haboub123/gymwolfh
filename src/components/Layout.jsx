import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar"; // Chemin vers Navbar, ajustez si nécessaire

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Rendre les composants des routes enfants */}
    </>
  );
};

export default Layout;