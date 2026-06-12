"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function HebergementsPage() {
  return (
    <ResourceManager
      title="Hébergements"
      apiPath="/api/admin/suites"
      columns={[
        { key: "image", label: "Photo", render: (v) => v ? <img src={v as string} className="w-14 h-10 object-cover rounded-lg" alt="" /> : "—" },
        { key: "name", label: "Nom" },
        { key: "type", label: "Type" },
        { key: "price", label: "Prix", render: (v, row) => `${v} ${row.currency}` },
        { key: "maxGuests", label: "Pers." },
        { key: "featured", label: "Prestige", render: (v) => v ? "✓" : "—" },
      ]}
      fields={[
        // Général
        { key: "name", label: "Nom", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "type", label: "Type", type: "select", options: ["suite", "chambre"] },
        { key: "tagline", label: "Accroche" },
        { key: "order", label: "Ordre", type: "number" },
        { key: "featured", label: "Prestige", type: "checkbox" },
        // Contenu (FR)
        { key: "description", label: "Description courte", type: "textarea" },
        { key: "longDescription", label: "Description longue", type: "textarea" },
        { key: "features", label: "Caractéristiques", type: "tags" },
        { key: "amenities", label: "Équipements", type: "tags" },
        // Anglais
        { key: "nameEn", label: "Nom (EN)" },
        { key: "taglineEn", label: "Accroche (EN)" },
        { key: "descriptionEn", label: "Description courte (EN)", type: "textarea" },
        { key: "longDescriptionEn", label: "Description longue (EN)", type: "textarea" },
        { key: "featuresEn", label: "Features (EN)", type: "tags" },
        { key: "amenitiesEn", label: "Amenities (EN)", type: "tags" },
        // Tarifs & Infos
        { key: "price", label: "Prix (actuel)", type: "number", required: true },
        { key: "originalPrice", label: "Prix original (avant remise)", type: "number" },
        { key: "currency", label: "Devise", type: "select", options: ["MAD", "EUR"] },
        { key: "maxGuests", label: "Nb. adultes max", type: "number" },
        { key: "maxChildren", label: "Nb. enfants max", type: "number" },
        { key: "bedType", label: "Type de lit" },
        { key: "size", label: "Surface (ex: 45m²)" },
        { key: "hasAC", label: "Climatisation", type: "checkbox" },
        // Médias
        { key: "image", label: "Image principale", type: "image", folder: "suites" },
        { key: "images", label: "Images supplémentaires", type: "images", folder: "suites" },
      ]}
      tabs={[
        { label: "Général", fieldKeys: ["name", "slug", "type", "tagline", "order", "featured"] },
        { label: "Contenu FR", fieldKeys: ["description", "longDescription", "features", "amenities"] },
        { label: "Contenu EN", fieldKeys: ["nameEn", "taglineEn", "descriptionEn", "longDescriptionEn", "featuresEn", "amenitiesEn"] },
        { label: "Tarifs & Infos", fieldKeys: ["price", "originalPrice", "currency", "maxGuests", "maxChildren", "bedType", "size", "hasAC"] },
        { label: "Médias", fieldKeys: ["image", "images"] },
      ]}
    />
  );
}
