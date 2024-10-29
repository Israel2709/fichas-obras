import React, { useState } from "react";

function ArtForm() {
  const [obras, setObras] = useState([
    {
      titulo: "",
      autor: "",
      anio: "",
      tecnica: "",
      medidas: "",
      enVenta: false,
      socials: { instagram: "", whatsapp: "", tiktok: "" },
    },
  ]);

  // Manejar el cambio de los campos de cada obra
  const handleChange = (index, field, value) => {
    const newObras = [...obras];
    newObras[index][field] = value;
    setObras(newObras);
  };

  // Manejar el cambio de las redes sociales de cada obra
  const handleSocialChange = (index, social, value) => {
    const newObras = [...obras];
    newObras[index].socials[social] = value;
    setObras(newObras);
  };

  // Agregar una nueva obra
  const addObra = () => {
    setObras([
      ...obras,
      {
        titulo: "",
        autor: "",
        anio: "",
        tecnica: "",
        medidas: "",
        enVenta: false,
        socials: { instagram: "", whatsapp: "", tiktok: "" },
        precio: "",
      },
    ]);
  };

  // Eliminar una obra
  const removeObra = (index) => {
    const newObras = [...obras];
    newObras.splice(index, 1);
    setObras(newObras);
  };

  // Enviar las obras al endpoint
  const handleSave = async () => {
    const endpoint =
      "https://fichas-obras-default-rtdb.firebaseio.com/rutaParanormal/.json";

    for (const obra of obras) {
      // Formatear las redes sociales
      const formattedSocials = Object.keys(obra.socials)
        .filter((key) => obra.socials[key].trim() !== "")
        .map((network) => ({
          network,
          value: obra.socials[network],
        }));

      // Crear el objeto que se enviará
      const obraData = {
        titulo: obra.titulo,
        autor: obra.autor,
        anio: obra.anio ? parseInt(obra.anio, 10) : "",
        tecnica: obra.tecnica,
        medidas: obra.medidas,
        enVenta: obra.enVenta,
        socials: formattedSocials.length > 0 ? formattedSocials : [],
        precio: obra.precio,
      };

      try {
        // Hacer la petición POST
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obraData),
        });
        if (!response.ok) {
          console.error("Error al enviar la obra:", response.statusText);
        }
      } catch (error) {
        console.error("Error de red al enviar la obra:", error);
      }
    }
    alert("Obras enviadas con éxito");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Formulario de Obras de Arte
      </h1>
      {obras.map((obra, index) => (
        <div key={index} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Obra {index + 1}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Título */}
            <div>
              <label className="block font-medium">Título:</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                value={obra.titulo}
                onChange={(e) => handleChange(index, "titulo", e.target.value)}
              />
            </div>

            {/* Autor */}
            <div>
              <label className="block font-medium">Autor:</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                value={obra.autor}
                onChange={(e) => handleChange(index, "autor", e.target.value)}
              />
            </div>

            {/* Año */}
            <div>
              <label className="block font-medium">Año:</label>
              <input
                type="number"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                value={obra.anio}
                onChange={(e) => handleChange(index, "anio", e.target.value)}
              />
            </div>

            {/* Técnica */}
            <div>
              <label className="block font-medium">Técnica:</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                value={obra.tecnica}
                onChange={(e) => handleChange(index, "tecnica", e.target.value)}
              />
            </div>

            {/* Medidas */}
            <div>
              <label className="block font-medium">Medidas:</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                value={obra.medidas}
                onChange={(e) => handleChange(index, "medidas", e.target.value)}
              />
            </div>

            {/* En Venta */}
            <div>
              <label className="block font-medium">En Venta:</label>
              <input
                type="checkbox"
                className="mt-1"
                checked={obra.enVenta}
                onChange={(e) =>
                  handleChange(index, "enVenta", e.target.checked)
                }
              />
            </div>
            {/*Precio*/}
            {obra.enVenta && (
              <div>
                <label className="block font-medium">Precio:</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  onChange={(e) =>
                    handleChange(index, "precio", e.target.value)
                  }
                />
              </div>
            )}
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="font-medium mb-2">Redes Sociales:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Instagram:</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={obra.socials.instagram}
                  onChange={(e) =>
                    handleSocialChange(index, "instagram", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block font-medium">WhatsApp:</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={obra.socials.whatsapp}
                  onChange={(e) =>
                    handleSocialChange(index, "whatsapp", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block font-medium">TikTok:</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value={obra.socials.tiktok}
                  onChange={(e) =>
                    handleSocialChange(index, "tiktok", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Botón para eliminar obra */}
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={() => removeObra(index)}
          >
            Eliminar Obra
          </button>
        </div>
      ))}

      {/* Botones de agregar obra y guardar */}
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={addObra}
        >
          Agregar Obra
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md"
          onClick={handleSave}
        >
          Guardar Obras
        </button>
      </div>
    </div>
  );
}

export default ArtForm;
