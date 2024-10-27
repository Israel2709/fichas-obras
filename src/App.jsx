import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ArtList from "./Components/ArtList";
import ArtForm from "./Components/ArtForm";
import whatsappLogo from "./assets/whatsapp.png";
import tiktokLogo from "./assets/tiktok.png";
import instagramLogo from "./assets/instagram.png";

function App() {
  const [works, setWorks] = useState([]);

  const socialIconsMap = {
    instagram: instagramLogo,
    whatsapp: whatsappLogo,
    tiktok: tiktokLogo,
  };

  useEffect(() => {
    const getAllWorks = async () => {
      const response = await fetch(
        "https://fichas-obras-default-rtdb.firebaseio.com/rutaParanormal/.json"
      );
      const data = await response.json();
      const worksArray = Object.keys(data).map((key) => data[key]);

      setWorks([...worksArray]);
    };
    getAllWorks();
  }, []);

  return (
    <Router>
      <div className="container mx-auto">
        {/* Barra de navegación */}
        <nav className="p-4 bg-gray-200 flex justify-between mb-8 print:hidden">
          {/* Añadimos la clase 'print:hidden' para ocultar durante la impresión */}
          <Link to="/" className="text-blue-500 font-bold text-xl">
            Home (Art List)
          </Link>
          <Link to="/artForm" className="text-blue-500 font-bold text-xl">
            Art Form
          </Link>
        </nav>

        {/* Configuración de las rutas */}
        <Routes>
          <Route
            path="/"
            element={<ArtList works={works} socialIconsMap={socialIconsMap} />}
          />
          <Route path="/artForm" element={<ArtForm />} />
        </Routes>
      </div>

      {/* Estilo CSS global para manejo de impresión */}
      <style jsx global>{`
        @media print {
          /* Ocultar la barra de navegación en la impresión */
          nav {
            display: none;
          }

          /* Ajustes adicionales de impresión */
          .container {
            width: 21cm;
            margin: 0 auto;
          }

          .print-page {
            display: flex;
            flex-direction: column; /* Mantener la columna */
            max-height: 27.94cm; /* Altura de la hoja carta */
            page-break-after: always; /* Romper al final de cada hoja */
            margin-bottom: 1cm; /* Espacio entre hojas */
          }

          .art-card {
            width: 100%;
            max-height: 8.5cm; /* Limitar la altura para evitar cortes */
            margin-bottom: 0;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Asegurar que no se corte el contenido de la hoja */
          .print-page:after {
            content: "";
            display: block;
            height: 1px;
            width: 100%;
            visibility: hidden;
            page-break-after: always;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;
