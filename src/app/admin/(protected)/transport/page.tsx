"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

const PRICING_LABELS: Record<string, string> = {
  forfait: "Forfait (un prix par réservation)",
  vehicule: "Par véhicule (selon la capacité)",
  personne: "Par personne",
};

export default function TransportAdminPage() {
  return (
    <div>
      <p className="px-4 sm:px-6 lg:px-8 pt-6 -mb-4 text-sm text-gray-500 dark:text-white/50 max-w-3xl">
        Les options actives sont proposées aux clients dans le formulaire de réservation. Changer un prix ne
        modifie pas les réservations déjà faites : elles gardent le montant enregistré au moment de la réservation.
      </p>
      <ResourceManager
        title="Transport"
        apiPath="/api/admin/transports"
        columns={[
          { key: "name", label: "Nom" },
          { key: "price", label: "Prix", render: (v, row) => `${v} ${row.currency}` },
          { key: "pricing", label: "Tarification", render: (v, row) => v === "vehicule" ? `Par véhicule (${row.capacity} pers.)` : v === "personne" ? "Par personne" : "Forfait" },
          { key: "active", label: "Proposé", render: (v) => (v ? "Oui" : "Non") },
          { key: "order", label: "Ordre" },
        ]}
        fields={[
          { key: "name", label: "Nom", required: true },
          { key: "active", label: "Proposé aux clients", type: "checkbox", defaultValue: true },
          { key: "order", label: "Ordre", type: "number" },
          { key: "price", label: "Prix", type: "number", required: true, defaultValue: 80 },
          { key: "currency", label: "Devise", type: "select", options: ["EUR", "MAD"], defaultValue: "EUR" },
          { key: "pricing", label: "Tarification", type: "select", options: ["forfait", "vehicule", "personne"], optionLabels: PRICING_LABELS, defaultValue: "forfait" },
          { key: "capacity", label: "Places par véhicule", type: "number", defaultValue: 4 },
          { key: "description", label: "Description", type: "textarea" },
          { key: "nameEn", label: "Name (EN)" },
          { key: "descriptionEn", label: "Description (EN)", type: "textarea" },
          { key: "nameEs", label: "Nombre (ES)" },
          { key: "descriptionEs", label: "Descripción (ES)", type: "textarea" },
          { key: "nameIt", label: "Nome (IT)" },
          { key: "descriptionIt", label: "Descrizione (IT)", type: "textarea" },
        ]}
        tabs={[
          { label: "Général", fieldKeys: ["name", "active", "order"] },
          { label: "Tarif", fieldKeys: ["price", "currency", "pricing", "capacity"] },
          { label: "Contenu FR", fieldKeys: ["description"] },
          { label: "Contenu EN", fieldKeys: ["nameEn", "descriptionEn"] },
          { label: "Contenu ES", fieldKeys: ["nameEs", "descriptionEs"] },
          { label: "Contenu IT", fieldKeys: ["nameIt", "descriptionIt"] },
        ]}
      />
    </div>
  );
}
