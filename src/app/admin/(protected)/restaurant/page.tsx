"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function RestaurantAdminPage() {
  return (
    <ResourceManager
      title="Restaurant & Lieux"
      apiPath="/api/admin/dining"
      columns={[
        { key: "name", label: "Nom" },
        { key: "capacity", label: "Capacité" },
        { key: "order", label: "Ordre" },
      ]}
      fields={[
        { key: "name", label: "Nom", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "order", label: "Ordre", type: "number" },
        { key: "capacity", label: "Capacité" },
        { key: "description", label: "Description courte", type: "textarea" },
        { key: "longDescription", label: "Description longue", type: "textarea" },
        { key: "image", label: "Image", type: "image", folder: "dining" },
      ]}
      tabs={[
        { label: "Général", fieldKeys: ["name", "slug", "order", "capacity"] },
        { label: "Contenu", fieldKeys: ["description", "longDescription"] },
        { label: "Médias", fieldKeys: ["image"] },
      ]}
    />
  );
}
