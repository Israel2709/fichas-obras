import React from "react";
import logo from "../assets/logo-restos-visuales.png"; // Ajusta la ruta según tu estructura de archivos
import qrAle from "../assets/qrs/ale.jpeg";
import qrDavid from "../assets/qrs/david.jpeg";
import qrLuisa from "../assets/qrs/luisa.jpeg";

const ArtList = ({ works, socialIconsMap }) => {
  return (
    <div className="container mx-auto">
      {/* Contenedor para las fichas */}
      <div className="print-page">
        {works.length > 0 &&
          works.map(
            (
              {
                anio,
                autor,
                enVenta,
                medidas,
                tecnica,
                titulo,
                socials,
                precio,
              },
              index
            ) => {
              return (
                <div
                  key={index}
                  className="art-card w-full border border-black p-4 mb-4 grid grid-cols-2"
                  style={{
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                  }}
                >
                  {/* Contenido de la ficha */}
                  <div className="ps-4 flex flex-col gap-2">
                    <p className="text-xl">
                      Título:{" "}
                      <span className="font-bold text-xl">"{titulo}"</span>
                    </p>
                    <p className="text-xl">Autor: {autor}</p>
                    <p className="text-xl">Técnica: {tecnica}</p>
                    <p className="text-xl">Medidas: {medidas}</p>
                    <p className="text-xl">Año: {anio}</p>
                    {enVenta && (
                      <p className="font-bold text-xl">
                        $ {precio && `${precio}.00 MXN`}
                      </p>
                    )}
                    {socials && (
                      <div className="flex flex-col gap-4">
                        {socials.map((social, socialIndex) => (
                          <div
                            key={socialIndex}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={socialIconsMap[social.network]}
                              alt={social.network}
                              className="w-[0.5cm]"
                            />
                            <span>{social.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end justify-end flex-col">
                    {autor === "David Ortiz" && (
                      <img src={qrDavid} alt="" className="w-[5cm]" />
                    )}
                    {autor === "Luisa González" && (
                      <img src={qrLuisa} alt="" className="w-[5cm]" />
                    )}
                    {autor === "Alejandro" && (
                      <img src={qrAle} alt="" className="w-[5cm]" />
                    )}
                    <img src={logo} alt="Logo" className="w-[5cm]" />
                  </div>
                </div>
              );
            }
          )}
      </div>

      {/* Estilo CSS para evitar cortes de página en impresión */}
      <style jsx global>{`
        @media print {
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
    </div>
  );
};

export default ArtList;
