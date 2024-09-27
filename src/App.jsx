import { useState, useEffect } from "react";
import logo from "./assets/hartasplastas.png";
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
        "https://fichas-obras-default-rtdb.firebaseio.com/festivalTerror/.json"
      );
      const data = await response.json();
      const worksArray = Object.keys(data).map((key) => (key, data[key]));
      setWorks([...worksArray]);
      console.log(worksArray);
    };
    getAllWorks();
  }, []);

  return (
    <>
      <div className="container mx-auto">
        {works.length &&
          works.map(
            ({ anio, autor, enVenta, medidas, tecnica, titulo, socials }) => {
              return (
                <div className="grid grid-cols-2 gap-4 w-[16cm] border border-black p-4">
                  <div className="ps-4 flex flex-col gap-4">
                    <p>
                      Título: <span className="font-bold">"{titulo}"</span>
                    </p>
                    <p>Autor: {autor}</p>
                    <p>Técnica: {tecnica}</p>
                    <p>Medidas: {medidas}</p>
                    <p>Año: {anio}</p>
                    {enVenta && <p className="font-bold">$</p>}
                    {socials && (
                      <div className="flex flex-col gap-4">
                        {socials.map((social) => {
                          return (
                            <div className="flex items-center gap-2">
                              <img
                                src={socialIconsMap[social.network]}
                                alt=""
                                className="w-[0.5cm]"
                              />
                              <span>{social.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end justify-end">
                    <img src={logo} alt="" className="w-[3cm]" />
                  </div>
                </div>
              );
            }
          )}
      </div>
    </>
  );
}

export default App;
