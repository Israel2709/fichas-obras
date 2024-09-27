import React, { useState } from "react";

const ArtForm = () => {
  const [obra, setObra] = useState({
    titulo: "",
    autor: "",
    anio: "",
    tecnica: "",
    medidas: "",
    enVenta: false,
    socials: { instagram: "", whatsapp: "", tiktok: "" },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setObra((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Obra agregada:", obra);
    // Aquí puedes agregar la lógica para enviar la obra al backend
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Agregar Nueva Obra
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block font-medium">Título:</label>
          <input
            type="text"
            name="titulo"
            value={obra.titulo}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">Autor:</label>
          <input
            type="text"
            name="autor"
            value={obra.autor}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">Año:</label>
          <input
            type="number"
            name="anio"
            value={obra.anio}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">Técnica:</label>
          <input
            type="text"
            name="tecnica"
            value={obra.tecnica}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">Medidas:</label>
          <input
            type="text"
            name="medidas"
            value={obra.medidas}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">En Venta:</label>
          <input
            type="checkbox"
            name="enVenta"
            checked={obra.enVenta}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Guardar Obra
        </button>
      </form>
    </div>
  );
};

export default ArtForm;
