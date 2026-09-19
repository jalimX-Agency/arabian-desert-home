import { format } from "date-fns";
import { computeItemPrice, type Catalog, type EditableItem, type ServiceType } from "../../reservations/_lib/item-types";
import type { DevisItem } from "./devis-utils";

export type DevisLineKind = "catalog" | "custom";

/** A quote line in the editor: a catalogue line behaves exactly like a reservation item,
 *  a free line is just a label with a quantity and a unit price. */
export type EditableDevisItem = EditableItem & {
  kind: DevisLineKind;
  label: string;
  description: string;
  unitPrice: number;
};

export function emptyDevisItem(currency: string, kind: DevisLineKind = "catalog"): EditableDevisItem {
  return {
    key: `new-${Date.now()}-${Math.random()}`,
    kind,
    serviceType: "suite",
    suiteId: "", activityId: "", dayPassId: "",
    checkIn: "", checkOut: "", date: "",
    quantity: 1, guests: 2, children: 0,
    totalAmount: 0, currency,
    customPrice: false,
    label: "", description: "", unitPrice: 0,
  };
}

export function devisItemToEditable(item: DevisItem): EditableDevisItem {
  return {
    key: item.id,
    id: item.id,
    kind: (item.kind === "custom" ? "custom" : "catalog") as DevisLineKind,
    serviceType: (item.kind === "custom" ? "suite" : item.serviceType) as ServiceType,
    suiteId: item.suiteId ?? "",
    activityId: item.activityId ?? "",
    dayPassId: item.dayPassId ?? "",
    checkIn: item.checkIn ? format(new Date(item.checkIn), "yyyy-MM-dd") : "",
    checkOut: item.checkOut ? format(new Date(item.checkOut), "yyyy-MM-dd") : "",
    date: item.date ? format(new Date(item.date), "yyyy-MM-dd") : "",
    quantity: item.quantity,
    guests: item.guests,
    children: item.children,
    totalAmount: item.totalAmount,
    currency: item.currency,
    // A saved catalogue line keeps the amount that was quoted, so never silently re-price it.
    customPrice: item.kind !== "custom",
    label: item.label,
    description: item.description ?? "",
    unitPrice: item.unitPrice,
  };
}

/** Free lines are quantity × unit price; catalogue lines fall back to the shared pricing. */
export function computeDevisLineTotal(item: EditableDevisItem, catalog: Catalog): number {
  if (item.kind === "custom") return Math.max(1, item.quantity) * Math.round(item.unitPrice);
  return computeItemPrice(item, catalog);
}

export function isDevisItemValid(item: EditableDevisItem): boolean {
  if (item.kind === "custom") return item.label.trim() !== "";
  return item.serviceType === "suite"
    ? item.suiteId !== "" && item.checkIn !== "" && item.checkOut !== ""
    : item.serviceType === "activity"
      ? item.activityId !== "" && item.date !== ""
      : item.dayPassId !== "" && item.date !== "";
}

export function devisItemToPayload(item: EditableDevisItem) {
  if (item.kind === "custom") {
    return {
      kind: "custom" as const,
      label: item.label.trim(),
      description: item.description.trim() || null,
      quantity: Math.max(1, item.quantity),
      unitPrice: Math.round(item.unitPrice),
    };
  }
  return {
    kind: "catalog" as const,
    serviceType: item.serviceType,
    suiteId: item.serviceType === "suite" ? item.suiteId : undefined,
    activityId: item.serviceType === "activity" ? item.activityId : undefined,
    dayPassId: item.serviceType === "daypass" ? item.dayPassId : undefined,
    checkIn: item.serviceType === "suite" ? item.checkIn : undefined,
    checkOut: item.serviceType === "suite" ? item.checkOut : undefined,
    date: item.serviceType !== "suite" ? item.date : undefined,
    quantity: item.serviceType === "suite" ? item.quantity : 1,
    guests: item.guests,
    children: item.children,
    label: item.label.trim() || undefined,
    description: item.description.trim() || null,
    totalAmount: item.totalAmount,
  };
}
