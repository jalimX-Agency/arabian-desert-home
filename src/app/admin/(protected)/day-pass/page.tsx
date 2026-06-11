"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function DayPassAdminPage() {
  return (
    <ResourceManager
      title="Day Pass"
      apiPath="/api/admin/day-passes"
      columns={[
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
        { key: "price", label: "Prix", type: "number", required: true },
        { key: "currency", label: "Devise", type: "select", options: ["MAD", "EUR"] },
        // Contenu FR
        { key: "description", label: "Description", type: "textarea" },
        { key: "includes", label: "Inclus", type: "tags" },
        // Contenu EN
        { key: "nameEn", label: "Name (EN)" },
        { key: "descriptionEn", label: "Description (EN)", type: "textarea" },
        { key: "includesEn", label: "Includes (EN)", type: "tags" },
        // Médias
        { key: "image", label: "Image principale", type: "image", folder: "gallery" },
      ]}
      tabs={[
        { label: "Général", fieldKeys: ["name", "slug", "order"] },
        { label: "Tarifs", fieldKeys: ["price", "currency"] },
        { label: "Contenu FR", fieldKeys: ["description", "includes"] },
        { label: "Contenu EN", fieldKeys: ["nameEn", "descriptionEn", "includesEn"] },
        { label: "Médias", fieldKeys: ["image"] },
      ]}
    />
  );
}
