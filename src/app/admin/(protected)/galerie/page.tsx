"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function GaleriePage() {
  return (
    <ResourceManager
      title="Galerie"
      apiPath="/api/admin/gallery"
      columns={[
        {
          key: "url",
          label: "Image",
          render: (v: unknown) =>
            v ? (
              <img src={v as string} alt="" className="w-16 h-10 object-cover rounded" />
            ) : (
              "—"
            ),
        },
        { key: "alt", label: "Légende FR" },
        { key: "category", label: "Catégorie" },
        { key: "featured", label: "Vedette", render: (v: unknown) => (v ? "✓" : "—") },
        { key: "order", label: "Ordre" },
      ]}
      fields={[
        { key: "url", label: "Image", type: "image", folder: "gallery", required: true },
        { key: "alt", label: "Légende FR" },
        { key: "altEn", label: "Légende EN" },
        { key: "caption", label: "Description FR", type: "textarea" },
        { key: "captionEn", label: "Description EN", type: "textarea" },
        {
          key: "category",
          label: "Catégorie",
          type: "select",
          options: ["general", "tentes", "piscine", "restaurant", "activites", "evenements"],
        },
        { key: "order", label: "Ordre", type: "number" },
        { key: "featured", label: "Vedette", type: "checkbox" },
      ]}
      tabs={[
        { label: "Média", fieldKeys: ["url"] },
        { label: "Infos FR", fieldKeys: ["alt", "caption"] },
        { label: "Infos EN", fieldKeys: ["altEn", "captionEn"] },
        { label: "Paramètres", fieldKeys: ["category", "order", "featured"] },
      ]}
    />
  );
}
