"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function ActivitesPage() {
  return (
    <ResourceManager
      title="Activités"
      apiPath="/api/admin/activities"
      columns={[
        { key: "image", label: "Photo", render: (v) => v ? <img src={v as string} className="w-14 h-10 object-cover rounded-lg" alt="" /> : "—" },
        { key: "name", label: "Nom" },
        { key: "category", label: "Catégorie" },
        { key: "price", label: "Prix", render: (v, row) => `${v} ${row.currency}` },
        { key: "duration", label: "Durée" },
        { key: "transportIncluded", label: "Transport", render: (v) => v ? "✓" : "—" },
      ]}
      fields={[
        // Général
        { key: "name", label: "Nom", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "category", label: "Catégorie", type: "select", options: ["Activité", "Expérience", "Aventure"] },
        { key: "order", label: "Ordre", type: "number" },
        { key: "featured", label: "Mis en avant", type: "checkbox" },
        // Contenu FR
        { key: "description", label: "Description courte", type: "textarea" },
        { key: "longDescription", label: "Description longue", type: "textarea" },
        { key: "includes", label: "Inclus", type: "tags" },
        { key: "schedule", label: "Horaires" },
        // Contenu EN
        { key: "nameEn", label: "Nom (EN)" },
        { key: "descriptionEn", label: "Description courte (EN)", type: "textarea" },
        { key: "longDescriptionEn", label: "Description longue (EN)", type: "textarea" },
        { key: "includesEn", label: "Includes (EN)", type: "tags" },
        // Contenu ES
        { key: "nameEs", label: "Nombre (ES)" },
        { key: "descriptionEs", label: "Descripción corta (ES)", type: "textarea" },
        { key: "longDescriptionEs", label: "Descripción larga (ES)", type: "textarea" },
        { key: "includesEs", label: "Incluye (ES)", type: "tags" },
        // Contenu IT
        { key: "nameIt", label: "Nome (IT)" },
        { key: "descriptionIt", label: "Descrizione breve (IT)", type: "textarea" },
        { key: "longDescriptionIt", label: "Descrizione lunga (IT)", type: "textarea" },
        { key: "includesIt", label: "Incluso (IT)", type: "tags" },
        // Tarifs
        { key: "price", label: "Prix (actuel)", type: "number", required: true },
        { key: "originalPrice", label: "Prix original (avant remise)", type: "number" },
        { key: "childPricePercent", label: "Prix enfant (%)", type: "number" },
        { key: "currency", label: "Devise", type: "select", options: ["MAD", "EUR"] },
        { key: "duration", label: "Durée (ex: 45 min)" },
        { key: "transportIncluded", label: "Transport inclus", type: "checkbox" },
        // Médias
        { key: "image", label: "Image principale", type: "image", folder: "activities" },
        { key: "images", label: "Images supplémentaires", type: "images", folder: "activities" },
      ]}
      tabs={[
        { label: "Général", fieldKeys: ["name", "slug", "category", "order", "featured"] },
        { label: "Contenu FR", fieldKeys: ["description", "longDescription", "includes", "schedule"] },
        { label: "Contenu EN", fieldKeys: ["nameEn", "descriptionEn", "longDescriptionEn", "includesEn"] },
        { label: "Contenu ES", fieldKeys: ["nameEs", "descriptionEs", "longDescriptionEs", "includesEs"] },
        { label: "Contenu IT", fieldKeys: ["nameIt", "descriptionIt", "longDescriptionIt", "includesIt"] },
        { label: "Tarifs", fieldKeys: ["price", "originalPrice", "childPricePercent", "currency", "duration", "transportIncluded"] },
        { label: "Médias", fieldKeys: ["image", "images"] },
      ]}
    />
  );
}
