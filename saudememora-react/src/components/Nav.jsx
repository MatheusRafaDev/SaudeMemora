import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Nav = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/home", icon: "bi-house", text: "Início" },
    { path: "/perfil", icon: "bi-person", text: "Perfil" },
    { path: "/meus-documentos", icon: "bi-file-earmark-medical", text: "Docs" },
    { path: "/upload-documentos", icon: "bi-cloud-arrow-up", text: "Enviar" },
    { path: "/visualizar-ficha", icon: "bi-file-text", text: "Ficha" }
  ];

  return (
    <>
      <nav className="bottom-nav d-flex justify-content-around align-items-center shadow-lg bg-primary text-white">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nav-item text-center px-2 py-1 flex-fill ${
              location.pathname === item.path ? "active" : ""
            }`}
            style={{
              color: location.pathname === item.path ? "#ffffff" : "#d1e5ff",
              fontWeight: location.pathname === item.path ? "600" : "400",
              textDecoration: "none",
              fontSize: "0.85rem"
            }}
          >
            <i className={`bi ${item.icon}`} style={{ fontSize: "1.2rem" }}></i>
            <div>{item.text}</div>
          </Link>
        ))}
      </nav>

      <style jsx="true">{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          z-index: 1050;
        }
        .bottom-nav .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .bottom-nav .active {
          border-top: 3px solid #ffffff;
        }

        @media (min-width: 992px) {
          .bottom-nav {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Nav;
