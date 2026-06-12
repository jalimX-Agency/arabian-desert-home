"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function BlogPage() {
  return (
    <ResourceManager
      title="Blog"
      apiPath="/api/admin/blog"
      columns={[
        { key: "image", label: "Photo", render: (v) => v ? <img src={v as string} className="w-14 h-10 object-cover rounded-lg" alt="" /> : "—" },
        { key: "title", label: "Titre" },
        { key: "category", label: "Catégorie" },
        { key: "author", label: "Auteur" },
        { key: "createdAt", label: "Date", render: (v) => new Date(v as string).toLocaleDateString("fr-FR") },
      ]}
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "category", label: "Catégorie", type: "select", options: ["Désert & Nature", "Expériences", "Gastronomie", "Activités", "Bien-être", "Conseils voyage", "Événements"] },
        { key: "author", label: "Auteur" },
        { key: "order", label: "Ordre", type: "number" },
        { key: "featured", label: "À la une", type: "checkbox" },
        { key: "excerpt", label: "Extrait", type: "textarea" },
        { key: "content", label: "Contenu (HTML)", type: "textarea" },
        { key: "titleEn", label: "Title (EN)" },
        { key: "excerptEn", label: "Excerpt (EN)", type: "textarea" },
        { key: "contentEn", label: "Content (EN)", type: "textarea" },
        { key: "image", label: "Image principale", type: "image", folder: "blog" },
      ]}
      tabs={[
        { label: "Général", fieldKeys: ["title", "category", "author", "order", "featured"] },
        { label: "Contenu FR", fieldKeys: ["excerpt", "content"] },
        { label: "Contenu EN", fieldKeys: ["titleEn", "excerptEn", "contentEn"] },
        { label: "Médias", fieldKeys: ["image"] },
      ]}
    />
  );
}
