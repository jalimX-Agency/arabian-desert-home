"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function TemoignagesPage() {
  return (
    <ResourceManager
      title="Témoignages"
      apiPath="/api/admin/testimonials"
      columns={[
        { key: "author", label: "Auteur" },
        { key: "location", label: "Lieu" },
        { key: "rating", label: "Note" },
        { key: "quote", label: "Avis", render: (v) => String(v).slice(0, 60) + "…" },
      ]}
      fields={[
        { key: "author", label: "Auteur", required: true },
        { key: "location", label: "Lieu" },
        { key: "source", label: "Source", type: "select", options: ["general", "booking", "tripadvisor", "google"] },
        { key: "order", label: "Ordre", type: "number" },
        { key: "rating", label: "Note (1-5)", type: "number" },
        { key: "quote", label: "Avis", type: "textarea", required: true },
      ]}
      tabs={[
        { label: "Auteur", fieldKeys: ["author", "location", "source", "order"] },
        { label: "Avis", fieldKeys: ["rating", "quote"] },
      ]}
    />
  );
}
