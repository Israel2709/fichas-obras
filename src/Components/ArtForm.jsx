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

  // Manejar los cambios de los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setObra((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejar cambios en las redes sociales
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setObra((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [name]: value,
      },
    }));
  };

  // Manejar el envío del formulario
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
        {/* Título */}
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

        {/* Autor */}
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

        {/* Año */}
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

        {/* Técnica */}
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

        {/* Medidas */}
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

        {/* En Venta */}
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

        {/* Redes Sociales */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Redes Sociales</h2>

          {/* Instagram */}
          <div>
            <label className="block font-medium">Instagram:</label>
            <input
              type="text"
              name="instagram"
              value={obra.socials.instagram}
              onChange={handleSocialChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md"
              placeholder="Ej: @nombreDeUsuario"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block font-medium">WhatsApp:</label>
            <input
              type="text"
              name="whatsapp"
              value={obra.socials.whatsapp}
              onChange={handleSocialChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md"
              placeholder="Número de WhatsApp"
            />
          </div>

          {/* TikTok */}
          <div>
            <label className="block font-medium">TikTok:</label>
            <input
              type="text"
              name="tiktok"
              value={obra.socials.tiktok}
              onChange={handleSocialChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md"
              placeholder="Ej: @nombreDeUsuario"
            />
          </div>
        </div>

        {/* Botón para guardar */}
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
