import React from "react";

export default function EditArtworkForm({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          value={data.titulo}
          onChange={(e) => onChange({ ...data, titulo: e.target.value })}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Técnica</label>
        <input
          value={data.tecnica}
          onChange={(e) => onChange({ ...data, tecnica: e.target.value })}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Medidas</label>
        <input
          value={data.medidas}
          onChange={(e) => onChange({ ...data, medidas: e.target.value })}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Año</label>
        <input
          value={data.anio}
          onChange={(e) => onChange({ ...data, anio: e.target.value })}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Precio</label>
        <input
          value={data.precio}
          onChange={(e) => onChange({ ...data, precio: e.target.value })}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.enVenta}
          onChange={(e) => onChange({ ...data, enVenta: e.target.checked })}
        />
        <label className="text-sm">En venta</label>
      </div>
    </div>
  );
}