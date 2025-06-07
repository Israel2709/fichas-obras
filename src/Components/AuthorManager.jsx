import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { database, storage } from "../firebase";
import Modal from "./Modal";
import {
  ref as dbRef,
  onValue,
  push,
  set,
  remove,
  get,
  child,
} from "firebase/database";
import {
  ref as storageRef,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const SOCIAL_NETWORKS = ["instagram", "tiktok", "whatsapp"];

export default function AuthorManager() {
  const [authors, setAuthors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [filterText, setFilterText] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
    },
  });

  const watchEnabledNetworks = SOCIAL_NETWORKS.map((network) =>
    watch(`enabled_${network}`)
  );

  useEffect(() => {
    const authorsRef = dbRef(database, "autores");
    const unsubscribe = onValue(authorsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const parsed = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      parsed.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setAuthors(parsed);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (authorId) => {
    setDeleteId(authorId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    const autorRef = dbRef(database, `autores/${deleteId}`);
    const autorSnap = await get(autorRef);

    if (autorSnap.exists()) {
      const autorData = autorSnap.val();
      const deletePromises = [];

      if (Array.isArray(autorData.socials)) {
        for (const social of autorData.socials) {
          if (social.qr) {
            try {
              const pathMatch = decodeURIComponent(social.qr).match(
                /\/o\/(.*?)\?/
              );
              if (pathMatch && pathMatch[1]) {
                const cleanPath = pathMatch[1].replace(/%2F/g, "/");
                const qrRef = storageRef(storage, cleanPath);
                deletePromises.push(deleteObject(qrRef));
              }
            } catch (err) {
              console.warn("No se pudo borrar el QR del storage:", err);
            }
          }
        }
      }

      deletePromises.push(remove(autorRef));

      const obrasSnapshot = await get(child(dbRef(database), "obras"));
      if (obrasSnapshot.exists()) {
        const obras = obrasSnapshot.val();
        for (const [id, obra] of Object.entries(obras)) {
          if (obra.autorId === deleteId) {
            deletePromises.push(remove(dbRef(database, `obras/${id}`)));
          }
        }
      }

      await Promise.all(deletePromises);
      setToastMessage("Autor y obras eliminados correctamente.");
    }

    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  const onSubmit = async (data) => {
    const socials = [];

    for (const network of SOCIAL_NETWORKS) {
      if (data[`enabled_${network}`]) {
        let qrUrl = "";
        const file = data[`qr_${network}`]?.[0];

        if (file) {
          const storagePath = `qr_codes/${Date.now()}_${file.name}`;
          const fileRef = storageRef(storage, storagePath);
          await uploadBytes(fileRef, file);
          qrUrl = await getDownloadURL(fileRef);
        }

        socials.push({
          network,
          value: data[`value_${network}`] || "",
          qr: qrUrl,
        });
      }
    }

    const payload = {
      nombre: data.nombre,
      socials,
    };

    setPendingPayload({ id: editingId, data: payload });
    setShowModal(true);
  };

  const confirmSave = async () => {
    if (pendingPayload) {
      if (pendingPayload.id) {
        await set(
          dbRef(database, `autores/${pendingPayload.id}`),
          pendingPayload.data
        );
        setToastMessage("Autor actualizado correctamente.");
      } else {
        const newRef = push(dbRef(database, "autores"));
        await set(newRef, pendingPayload.data);
        setToastMessage("Autor agregado correctamente.");
      }
    }
    reset();
    setEditingId(null);
    setShowModal(false);
    setPendingPayload(null);
  };

  const handleEdit = (author) => {
    reset();
    setEditingId(author.id);
    setValue("nombre", author.nombre);

    SOCIAL_NETWORKS.forEach((network) => {
      const item = author.socials?.find((s) => s.network === network);
      setValue(`enabled_${network}`, !!item);
      setValue(`value_${network}`, item?.value || "");
    });
  };

  const filteredAuthors = authors.filter((author) =>
    author.nombre.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Toast message */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {toastMessage}
          <button
            onClick={() => setToastMessage("")}
            className="ml-4 text-sm text-green-700 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow p-4 rounded mb-6"
      >
        <div className="mb-4">
          <label className="block font-bold mb-1">Nombre</label>
          <input
            {...register("nombre", { required: true })}
            className={classNames(
              "w-full border px-2 py-1 rounded",
              errors.nombre && "border-red-500"
            )}
          />
        </div>

        <fieldset className="mb-4">
          <legend className="font-bold mb-2">Redes sociales</legend>
          {SOCIAL_NETWORKS.map((network, index) => (
            <div key={network} className="mb-2 border p-2 rounded">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(`enabled_${network}`)}
                  className="mr-2"
                />
                {network.charAt(0).toUpperCase() + network.slice(1)}
              </label>
              {watchEnabledNetworks[index] && (
                <div className="ml-6 mt-2">
                  <label className="block text-sm font-medium mb-1">
                    URL o identificador
                  </label>
                  <input
                    {...register(`value_${network}`)}
                    className="w-full border px-2 py-1 rounded mb-2"
                  />
                  <label className="block text-sm font-medium mb-1">
                    QR (archivo de imagen)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register(`qr_${network}`)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Actualizar" : "Agregar"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              reset();
              setEditingId(null);
            }}
            className="ml-4 text-sm text-gray-600"
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="mb-4">
        <label className="block font-bold mb-1">Buscar autor</label>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Escribe un nombre..."
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <Modal
        isOpen={showModal}
        message="¿Deseas guardar los cambios de este autor?"
        onConfirm={confirmSave}
        onCancel={() => {
          setShowModal(false);
          setPendingPayload(null);
        }}
      />

      <Modal
        isOpen={deleteModalOpen}
        message="¿Eliminar este autor y TODAS sus obras?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteId(null);
          setDeleteModalOpen(false);
        }}
      />

      <div>
        <h3 className="text-xl font-bold mb-2">Autores registrados</h3>
        <ul className="space-y-2">
          {filteredAuthors.map((author) => (
            <li
              key={author.id}
              className="border p-3 flex justify-between items-center"
            >
              <p className="font-semibold">{author.nombre}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(author)}
                  className="text-blue-500 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(author.id)}
                  className="text-red-500 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
