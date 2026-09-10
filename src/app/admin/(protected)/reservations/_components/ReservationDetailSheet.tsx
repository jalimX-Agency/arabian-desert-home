"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ReservationGroup,
  statusOptions,
  statusColors,
  CHANNELS,
  channelLabel,
  groupChannel,
} from "../_lib/reservation-utils";
import {
  Catalog, CatalogSuite, CatalogActivity, CatalogDayPass,
  EditableItem, bookingToEditable, emptyItem, computeItemPrice,
  fetchCatalog, isItemValid, itemToPayload,
} from "../_lib/item-types";
import { ItemCard } from "./ItemCard";
import { ConfirmDialog } from "./ConfirmDialog";

interface ReservationDetailSheetProps {
  group: ReservationGroup | null;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (group: ReservationGroup, status: string) => void;
  onSaved: () => void;
  statusSaving: boolean;
}

export function ReservationDetailSheet({
  group,
  onOpenChange,
  onStatusChange,
  onSaved,
  statusSaving,
}: ReservationDetailSheetProps) {
  const [suites, setSuites] = useState<CatalogSuite[]>([]);
  const [activities, setActivities] = useState<CatalogActivity[]>([]);
  const [dayPasses, setDayPasses] = useState<CatalogDayPass[]>([]);
  const catalog: Catalog = { suites, activities, dayPasses };

  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", specialReqs: "", channel: "website" });
  const [items, setItems] = useState<EditableItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  useEffect(() => { fetchCatalog(setSuites, setActivities, setDayPasses); }, []);

  useEffect(() => {
    if (!group) return;
    const primary = group.items[0];
    setContact({
      firstName: primary.firstName,
      lastName: primary.lastName,
      email: primary.email,
      phone: primary.phone ?? "",
      specialReqs: primary.specialReqs ?? "",
      channel: groupChannel(group),
    });
    setItems(group.items.map(bookingToEditable));
  }, [group]);

  // Keep auto-priced items (not manually overridden) in sync with date/service/guest changes.
  useEffect(() => {
    setItems((prev) =>
      prev.map((it) => (it.customPrice ? it : { ...it, totalAmount: computeItemPrice(it, catalog) }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suites, activities, dayPasses, JSON.stringify(items.map((i) => [i.serviceType, i.suiteId, i.activityId, i.dayPassId, i.checkIn, i.checkOut, i.date, i.guests, i.children, i.quantity]))]);

  const grandTotal = useMemo(() => items.reduce((sum, it) => sum + it.totalAmount, 0), [items]);
  const currency = items[0]?.currency ?? "MAD";

  function updateItem(key: string, patch: Partial<EditableItem>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }

  const isValid =
    contact.firstName.trim() !== "" &&
    contact.lastName.trim() !== "" &&
    contact.email.trim() !== "" &&
    contact.phone.trim() !== "" &&
    items.length > 0 &&
    items.every(isItemValid);

  async function handleSave() {
    if (!group || !isValid) return;
    setSaving(true);
    try {
      const originalIds = new Set(group.items.map((b) => b.id));
      const keptIds = new Set(items.filter((it) => it.id).map((it) => it.id!));
      const deletedItems = [...originalIds]
        .filter((id) => !keptIds.has(id))
        .map((id) => ({ id, _delete: true, serviceType: "suite" as const, guests: 0, children: 0, totalAmount: 0 }));

      const payload = {
        contact: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          specialReqs: contact.specialReqs || undefined,
          channel: contact.channel,
        },
        items: [...items.map(itemToPayload), ...deletedItems],
      };

      await fetch(`/api/admin/reservations/${group.id}/details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSaved();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  if (!group) return null;
  const primary = group.items[0];

  return (
    <Sheet open={group !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{primary.firstName} {primary.lastName}</SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-4">
          {/* Status quick actions */}
          <div className="flex items-center gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(group, s)}
                disabled={statusSaving}
                className={`flex-1 px-3 py-2 rounded-lg text-xs uppercase tracking-widest font-medium border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
                  primary.status === s
                    ? statusColors[s]
                    : "border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-gray-400">Client</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Prénom</Label>
                <Input value={contact.firstName} onChange={(e) => setContact((c) => ({ ...c, firstName: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Nom</Label>
                <Input value={contact.lastName} onChange={(e) => setContact((c) => ({ ...c, lastName: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Email</Label>
                <Input type="email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Téléphone</Label>
                <Input value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Canal</Label>
                <Select value={contact.channel} onValueChange={(v) => setContact((c) => ({ ...c, channel: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((c) => <SelectItem key={c} value={c}>{channelLabel[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Reçue le</Label>
                <p className="text-sm text-gray-900 dark:text-white py-2">{format(new Date(primary.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Demandes spéciales</Label>
              <Textarea value={contact.specialReqs} onChange={(e) => setContact((c) => ({ ...c, specialReqs: e.target.value }))} rows={2} />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-gray-400">Prestations ({items.length})</p>
              <Button variant="outline" size="sm" onClick={() => setItems((prev) => [...prev, emptyItem()])} className="cursor-pointer text-xs">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </Button>
            </div>

            {items.map((item) => (
              <ItemCard
                key={item.key}
                item={item}
                catalog={catalog}
                computedPrice={(it) => computeItemPrice(it, catalog)}
                onChange={(patch) => updateItem(item.key, patch)}
                onRemove={() => setConfirmDeleteKey(item.key)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500 dark:text-white/60">Montant total</span>
            <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">{grandTotal.toLocaleString("fr-FR")} {currency}</span>
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={!isValid || saving} className="cursor-pointer">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
          <p className="text-[11px] text-gray-400 text-center">La réservation sera confirmée et le client recevra sa fiche par email.</p>
        </SheetFooter>
      </SheetContent>

      <ConfirmDialog
        open={confirmDeleteKey !== null}
        onOpenChange={(open) => !open && setConfirmDeleteKey(null)}
        title="Supprimer cette prestation ?"
        description="Cette prestation sera retirée de la réservation une fois les modifications enregistrées."
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => {
          if (confirmDeleteKey) setItems((prev) => prev.filter((it) => it.key !== confirmDeleteKey));
        }}
      />
    </Sheet>
  );
}
