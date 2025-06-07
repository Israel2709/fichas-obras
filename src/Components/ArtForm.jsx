import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, onValue, push, set, get, update } from "firebase/database";
import { database } from "../firebase";
import moment from "moment";
import Modal from "./Modal";

function ArtForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const galeriaDesdeRuta = location.state?.galeriaId || "";

  const [galerias, setGalerias] = useState({});
  const [galeriaSeleccionada, setGaleriaSeleccionada] =
    useState(galeriaDesdeRuta);
  const [nuevaGaleriaModal, setNuevaGaleriaModal] = useState(false);
  const [nuevaGaleriaNombre, setNuevaGaleriaNombre] = useState("");
  const [obrasPorAgregar, setObrasPorAgregar] = useState([]);
  const [todasLasObras, setTodasLasObras] = useState({});
  const [autores, setAutores] = useState({});
  const [autorSeleccionadoId, setAutorSeleccionadoId] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    anio: "",
    tecnica: "",
    medidas: "",
    enVenta: false,
    precio: "",
    socials: {
      instagram: "",
      whatsapp: "",
      tiktok: "",
    },
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    onValue(ref(database, "galerias"), (snapshot) => {
      const data = snapshot.val() || {};
      setGalerias(data);
      if (!galeriaSeleccionada) {
        const ordenadas = Object.entries(data).sort(
          ([, a], [, b]) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        if (ordenadas.length > 0) {
          setGaleriaSeleccionada(ordenadas[0][0]);
        }
      }
    });

    onValue(ref(database, "obras"), (snapshot) => {
      const data = snapshot.val() || {};
      setTodasLasObras(data);
    });

    onValue(ref(database, "autores"), (snapshot) => {
      const data = snapshot.val() || {};
      setAutores(data);
    });
  }, []);

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const autocompletarDesdeObra = (titulo) => {
    const encontrada = Object.values(todasLasObras).find(
      (o) => o.titulo === titulo
    );
    if (encontrada) {
      setForm((prev) => ({
        ...prev,
        autor: encontrada.autor || "",
        anio: encontrada.anio || "",
        tecnica: encontrada.tecnica || "",
        medidas: encontrada.medidas || "",
        socials:
          encontrada.socials?.reduce((acc, s) => {
            acc[s.network] = s.value;
            return acc;
          }, {}) || {},
      }));
    }
  };

  const autocompletarDesdeAutor = (nombre) => {
    const [id, autor] =
      Object.entries(autores).find(([, v]) => v.nombre === nombre) || [];
    if (autor) {
      setAutorSeleccionadoId(id);
      setForm((prev) => ({
        ...prev,
        socials:
          autor.socials?.reduce((acc, s) => {
            acc[s.network] = s.value;
            return acc;
          }, {}) || {},
      }));
    } else {
      setAutorSeleccionadoId(null);
    }
  };

  const handleAgregarObra = () => {
    setObrasPorAgregar((prev) => [
      ...prev,
      { ...form, autorId: autorSeleccionadoId },
    ]);
    setForm({
      titulo: "",
      autor: "",
      anio: "",
      tecnica: "",
      medidas: "",
      enVenta: false,
      precio: "",
      socials: {
        instagram: "",
        whatsapp: "",
        tiktok: "",
      },
    });
    setAutorSeleccionadoId(null);
    mostrarToast("Obra agregada a la lista");
  };

  const guardarListaObras = async () => {
    const updates = {};
    const obrasRef = ref(database, "obras");
    const autoresRef = ref(database, "autores");
    const galeriaRef = ref(database, `galerias/${galeriaSeleccionada}/obras`);

    for (const obra of obrasPorAgregar) {
      let autorId = obra.autorId;

      if (!autorId) {
        const nuevoAutorRef = push(autoresRef);
        autorId = nuevoAutorRef.key;
        const autorSocials = Object.entries(obra.socials)
          .filter(([, v]) => v.trim() !== "")
          .map(([network, value]) => ({ network, value }));
        updates[`/autores/${autorId}`] = {
          nombre: obra.autor,
          socials: autorSocials,
        };
      }

      const newObraRef = push(obrasRef);
      const obraId = newObraRef.key;
      const obraSocials = Object.entries(obra.socials)
        .filter(([, v]) => v.trim() !== "")
        .map(([network, value]) => ({ network, value }));

      updates[`/obras/${obraId}`] = {
        titulo: obra.titulo,
        autor: obra.autor,
        autorId,
        anio: obra.anio,
        tecnica: obra.tecnica,
        medidas: obra.medidas,
        enVenta: obra.enVenta,
        precio: obra.precio,
        socials: obraSocials,
      };

      updates[`/galerias/${galeriaSeleccionada}/obras/${obraId}`] = true;
    }

    await update(ref(database), updates);
    navigate("/", { state: { galeriaId: galeriaSeleccionada } });
  };

  const crearGaleria = async () => {
    const nuevaRef = push(ref(database, "galerias"));
    const id = nuevaRef.key;
    await set(nuevaRef, {
      nombre: nuevaGaleriaNombre,
      createdAt: moment().toISOString(),
    });
    setGaleriaSeleccionada(id);
    setNuevaGaleriaModal(false);
    setNuevaGaleriaNombre("");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {toast && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded mb-4">
          {toast}
        </div>
      )}

      <Modal
        isOpen={nuevaGaleriaModal}
        message={
          <div>
            <p className="mb-2 font-bold">Nombre de la nueva galería:</p>
            <input
              type="text"
              value={nuevaGaleriaNombre}
              onChange={(e) => setNuevaGaleriaNombre(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        }
        onConfirm={crearGaleria}
        onCancel={() => setNuevaGaleriaModal(false)}
      />

      <Modal
        isOpen={confirmModal}
        message={`¿Guardar las obras en la galería "${galerias[galeriaSeleccionada]?.nombre}"?`}
        onConfirm={guardarListaObras}
        onCancel={() => setConfirmModal(false)}
      />

      <h1 className="text-3xl font-bold text-center mb-6">
        Agregar Obras a Galería
      </h1>

      <h1 className="text-2xl font-bold mb-4">Agregar obras a la galería</h1>

      <div className="mb-6 flex gap-4">
        <select
          value={galeriaSeleccionada}
          onChange={(e) => setGaleriaSeleccionada(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {Object.entries(galerias).map(([id, g]) => (
            <option key={id} value={id}>
              {g.nombre}
            </option>
          ))}
        </select>
        <button
          onClick={() => setNuevaGaleriaModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear nueva galería
        </button>
      </div>

      <details className="mb-6 border rounded bg-white p-4 shadow">
        <summary className="cursor-pointer font-bold text-lg">
          {obrasPorAgregar.length} obra
          {obrasPorAgregar.length !== 1 ? "s" : ""} en la lista
        </summary>
        <ul className="mt-4 space-y-2">
          {obrasPorAgregar.map((obra, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border-b pb-1"
            >
              <span>
                {obra.titulo} - {obra.autor}
              </span>
              <button
                onClick={() =>
                  setObrasPorAgregar(
                    obrasPorAgregar.filter((_, i) => i !== idx)
                  )
                }
                className="text-red-600 text-sm"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </details>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Título */}
          <div>
            <label className="block font-medium">Título:</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, titulo: e.target.value }));
                autocompletarDesdeObra(e.target.value);
              }}
              className="w-full border px-2 py-1 rounded"
              list="sugerencias-titulo"
            />
            <datalist id="sugerencias-titulo">
              {Object.values(todasLasObras).map((obra, idx) => (
                <option key={idx} value={obra.titulo} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block font-medium">Autor:</label>
            <input
              type="text"
              value={form.autor}
              onChange={(e) => {
                const nombre = e.target.value;
                setForm((prev) => ({ ...prev, autor: nombre }));
                autocompletarDesdeAutor(nombre);
              }}
              className="w-full border px-2 py-1 rounded"
              list="sugerencias-autor"
            />
            <datalist id="sugerencias-autor">
              {Object.values(autores).map((autor, idx) => (
                <option key={idx} value={autor.nombre} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block font-medium">Año:</label>
            <input
              type="number"
              className="w-full border px-2 py-1 rounded"
              value={form.anio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, anio: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block font-medium">Técnica:</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              value={form.tecnica}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tecnica: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block font-medium">Medidas:</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              value={form.medidas}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, medidas: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.enVenta}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, enVenta: e.target.checked }))
              }
            />
            <label className="block font-medium">En venta</label>
          </div>

          {form.enVenta && (
            <div>
              <label className="block font-medium">Precio:</label>
              <input
                type="text"
                className="w-full border px-2 py-1 rounded"
                value={form.precio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, precio: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {["instagram", "whatsapp", "tiktok"].map((net) => (
            <div key={net}>
              <label className="block font-medium capitalize">{net}:</label>
              <input
                type="text"
                className="w-full border px-2 py-1 rounded"
                value={form.socials[net]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    socials: { ...prev.socials, [net]: e.target.value },
                  }))
                }
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleAgregarObra}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Agregar obra a la lista
        </button>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setConfirmModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Guardar lista de obras
        </button>
      </div>
    </div>
  );
}

export default ArtForm;
