import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase";
import { ref, onValue, update, remove, get } from "firebase/database";
import logo from "../assets/logo-vuelta-al-mundo.png";
import Modal from "./Modal";
import EditArtworkForm from "./EditArtworkForm";

const defaultSocialIconsMap = {
  instagram: "/path/to/instagram.png",
  tiktok: "/path/to/tiktok.png",
  whatsapp: "/path/to/whatsapp.png",
};

const ArtList = ({ socialIconsMap = defaultSocialIconsMap }) => {
  const [galerias, setGalerias] = useState({});
  const [galeriaSeleccionada, setGaleriaSeleccionada] = useState("");
  const [obras, setObras] = useState([]);
  const [autores, setAutores] = useState({});
  const [filtro, setFiltro] = useState("");
  const [modal, setModal] = useState({ show: false, action: null, obra: null });
  const [toast, setToast] = useState("");
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const autoresRef = ref(database, "autores");
    onValue(autoresRef, (snapshot) => {
      setAutores(snapshot.val() || {});
    });
  }, []);

  useEffect(() => {
    const galRef = ref(database, "galerias");
    onValue(galRef, (snapshot) => {
      const data = snapshot.val() || {};
      setGalerias(data);
      const ordenadas = Object.entries(data).sort(
        ([, a], [, b]) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      if (ordenadas.length > 0) setGaleriaSeleccionada(ordenadas[0][0]);
    });
  }, []);

  useEffect(() => {
    if (!galeriaSeleccionada) return;

    const galeriaRef = ref(database, `galerias/${galeriaSeleccionada}/obras`);
    onValue(galeriaRef, async (snapshot) => {
      const data = snapshot.val() || {};
      const ids = Object.keys(data);

      const obrasRef = ref(database, "obras");
      const obrasSnapshot = await get(obrasRef);
      const todasLasObras = obrasSnapshot.val() || {};

      const lista = ids
        .map((id) => {
          const obra = todasLasObras[id];
          return obra ? { id, ...obra } : null;
        })
        .filter(Boolean);

      setObras(lista);
    });
  }, [galeriaSeleccionada]);

  const obrasFiltradas = obras.filter((obra) =>
    `${obra.titulo} ${obra.autor}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const eliminarObra = async (obraId) => {
    await remove(
      ref(database, `galerias/${galeriaSeleccionada}/obras/${obraId}`)
    );
    mostrarToast("Obra eliminada de la galería");
  };

  const guardarEdicion = async () => {
    if (!editData?.id) return;
    const payload = {
      titulo: editData.titulo || "",
      tecnica: editData.tecnica || "",
      medidas: editData.medidas || "",
      anio: editData.anio || "",
      precio: editData.precio || "",
      enVenta: !!editData.enVenta,
    };
    await update(ref(database, `obras/${editData.id}`), payload);
    setModal({ show: false, action: null, obra: null });
    setEditData(null);
    mostrarToast("Obra actualizada");
  };

  return (
    <div className="container mx-auto px-4">
      {toast && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {toast}
        </div>
      )}

      <Modal
        isOpen={modal.show}
        message={
          modal.action === "eliminar" ? (
            "¿Eliminar esta obra de la galería?"
          ) : (
            <EditArtworkForm data={editData} onChange={setEditData} />
          )
        }
        onConfirm={() => {
          if (modal.action === "eliminar") eliminarObra(modal.obra.id);
          if (modal.action === "editar") guardarEdicion();
        }}
        onCancel={() => {
          setModal({ show: false, action: null, obra: null });
          setEditData(null);
        }}
      />

      <div className="print:hidden mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <select
            className="border px-2 py-1 rounded"
            value={galeriaSeleccionada}
            onChange={(e) => setGaleriaSeleccionada(e.target.value)}
          >
            {Object.entries(galerias).map(([id, g]) => (
              <option key={id} value={id}>
                {g.nombre || id}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Buscar por título o autor"
            className="border px-2 py-1 rounded w-full md:w-1/2"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      {obrasFiltradas.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-xl font-semibold mb-4">
            No hay obras en esta galería.
          </p>
          <button
            onClick={() => navigate("/artForm")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Agregar obra
          </button>
        </div>
      ) : (
        <div className="print-page">
          {obrasFiltradas.map((obra) => {
            const autor = autores[obra.autorId];

            return (
              <div
                key={obra.id}
                className="art-card w-full border border-black p-4 mb-4 grid grid-cols-3 relative"
                style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
              >
                <div className="ps-4 flex flex-col gap-2 col-span-2">
                  <p className="text-xl">
                    Título:{" "}
                    <span className="font-bold text-xl">"{obra.titulo}"</span>
                  </p>
                  <p className="text-xl">Autor: {obra.autor}</p>
                  <p className="text-xl">Técnica: {obra.tecnica}</p>
                  <p className="text-xl">Medidas: {obra.medidas}</p>
                  <p className="text-xl">Año: {obra.anio}</p>
                  {obra.enVenta && (
                    <p className="font-bold text-xl">
                      $ {obra.precio && `${obra.precio}.00 MXN`}
                    </p>
                  )}
                  {autor?.socials && (
                    <div className="flex flex-col gap-4 mt-2">
                      {autor.socials.map((social, i) => (
                        <div key={i} className="flex items-center gap-2">
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

                <div className="flex items-end justify-end flex-col gap-4">
                  <div className="flex justify-center items-center">
                    {autor?.socials?.map(
                      (s, i) =>
                        s.qr && (
                          <img key={i} src={s.qr} alt="" className="w-[3cm]" />
                        )
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-base font-pirata custom-shadow text-center">
                      La vuelta <br />
                      al mundo <br />
                      En {obrasFiltradas.length} obra
                      {obrasFiltradas.length !== 1 && "s"}
                    </p>
                    <img src={logo} alt="Logo" className="w-[3cm]" />
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-2 print:hidden">
                  <button
                    onClick={() => {
                      setEditData({ ...obra });
                      setModal({ show: true, action: "editar", obra });
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      setModal({ show: true, action: "eliminar", obra })
                    }
                    className="text-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .container {
            width: 21cm;
            margin: 0 auto;
          }
          .print-page {
            display: flex;
            flex-direction: column;
            max-height: 27.94cm;
            page-break-after: always;
            margin-bottom: 1cm;
          }
          .art-card {
            width: 100%;
            max-height: 8.5cm;
            margin-bottom: 0;
            page-break-inside: avoid;
            break-inside: avoid;
          }
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
