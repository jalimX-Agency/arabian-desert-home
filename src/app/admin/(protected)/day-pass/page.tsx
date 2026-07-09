"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function DayPassAdminPage() {
  return (
    <ResourceManager
      title="Day Pass"
      apiPath="/api/admin/day-passes"
      columns={[
        { key: "image", label: "Photo", render: (v) => v ? <img src={v as string} className="w-14 h-10 object-cover rounded-lg" alt="" /> : "—" },
        { key: "name", label: "Nom" },
        { key: "price", label: "Prix", render: (v, row) => `${v} ${row.currency}` },
        { key: "order", label: "Ordre" },
      ]}
      fields={[
        // Général
        { key: "name", label: "Nom", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "order", label: "Ordre", type: "number" },
        // Tarifs
        { key: "price", label: "Prix (actuel)", type: "number", required: true },
        { key: "originalPrice", label: "Prix original (avant remise)", type: "number" },
        { key: "childPricePercent", label: "Prix enfant (%)", type: "number" },
        { key: "currency", label: "Devise", type: "select", options: ["MAD", "EUR"] },
        // Contenu FR
        { key: "description", label: "Description", type: "textarea" },
        { key: "includes", label: "Inclus", type: "tags" },
        // Contenu EN
        { key: "nameEn", label: "Name (EN)" },
        { key: "descriptionEn", label: "Description (EN)", type: "textarea" },
        { key: "includesEn", label: "Includes (EN)", type: "tags" },
        // Contenu ES
        { key: "nameEs", label: "Nombre (ES)" },
        { key: "descriptionEs", label: "Descripción (ES)", type: "textarea" },
        { key: "includesEs", label: "Incluye (ES)", type: "tags" },
        // Contenu IT
        { key: "nameIt", label: "Nome (IT)" },
        { key: "descriptionIt", label: "Descrizione (IT)", type: "textarea" },
        { key: "includesIt", label: "Incluso (IT)", type: "tags" },
        // Médias
        { key: "image", label: "Image principale", type: "image", folder: "gallery" },
      ]}
      tabs={[
        { label: "Général", fieldKeys: ["name", "slug", "order"] },
        { label: "Tarifs", fieldKeys: ["price", "originalPrice", "childPricePercent", "currency"] },
        { label: "Contenu FR", fieldKeys: ["description", "includes"] },
        { label: "Contenu EN", fieldKeys: ["nameEn", "descriptionEn", "includesEn"] },
        { label: "Contenu ES", fieldKeys: ["nameEs", "descriptionEs", "includesEs"] },
        { label: "Contenu IT", fieldKeys: ["nameIt", "descriptionIt", "includesIt"] },
        { label: "Médias", fieldKeys: ["image"] },
      ]}
    />
  );
}
