"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { CHANNELS, channelLabel, statusOptions } from "../_lib/reservation-utils";
import {
  Catalog, CatalogSuite, CatalogActivity, CatalogDayPass,
  EditableItem, emptyItem, computeItemPrice, fetchCatalog, isItemValid, itemToPayload,
} from "../_lib/item-types";
import { ItemCard } from "./ItemCard";

const MANUAL_CHANNELS = CHANNELS.filter((c) => c !== "website");

interface NewReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function NewReservationDialog({ open, onOpenChange, onCreated }: NewReservationDialogProps) {
  const [suites, setSuites] = useState<CatalogSuite[]>([]);
  const [activities, setActivities] = useState<CatalogActivity[]>([]);
  const [dayPasses, setDayPasses] = useState<CatalogDayPass[]>([]);
  const catalog: Catalog = { suites, activities, dayPasses };

  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", specialReqs: "" });
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("pending");
  const [notifyClient, setNotifyClient] = useState(true);
  const [items, setItems] = useState<EditableItem[]>([emptyItem()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) fetchCatalog(setSuites, setActivities, setDayPasses); }, [open]);

  // Sensible default: OTA platforms handle their own guest comms, so don't notify by default.
  useEffect(() => {
    setNotifyClient(channel === "email" || channel === "whatsapp");
  }, [channel]);

  useEffect(() => {
    setItems((prev) => prev.map((it) => (it.customPrice ? it : { ...it, totalAmount: computeItemPrice(it, catalog) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suites, activities, dayPasses, JSON.stringify(items.map((i) => [i.serviceType, i.suiteId, i.activityId, i.dayPassId, i.checkIn, i.checkOut, i.date, i.guests, i.children, i.quantity]))]);

  function updateItem(key: string, patch: Partial<EditableItem>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }

  const grandTotal = items.reduce((sum, it) => sum + it.totalAmount, 0);
  const currency = items[0]?.currency ?? "MAD";

  const isValid =
    contact.firstName.trim() !== "" &&
    contact.lastName.trim() !== "" &&
    contact.email.trim() !== "" &&
    contact.phone.trim() !== "" &&
    channel !== "" &&
    items.length > 0 &&
    items.every(isItemValid);

  function resetForm() {
    setContact({ firstName: "", lastName: "", email: "", phone: "", specialReqs: "" });
    setChannel("");
    setStatus("pending");
    setItems([emptyItem()]);
  }

  async function handleCreate() {
    if (!isValid) return;
    setSaving(true);
    try {
      await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          specialReqs: contact.specialReqs || undefined,
          channel,
          status,
          notifyClient,
          items: items.map(itemToPayload),
        }),
      });
      resetForm();
      onCreated();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle réservation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                <Label className="text-xs text-gray-400 mb-1 block">Canal *</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="D'où vient cette réservation ?" /></SelectTrigger>
                  <SelectContent>
                    {MANUAL_CHANNELS.map((c) => <SelectItem key={c} value={c}>{channelLabel[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Statut initial</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Demandes spéciales</Label>
              <Textarea value={contact.specialReqs} onChange={(e) => setContact((c) => ({ ...c, specialReqs: e.target.value }))} rows={2} />
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/60 cursor-pointer">
              <Checkbox checked={notifyClient} onCheckedChange={(v) => setNotifyClient(v === true)} />
              Envoyer un email de confirmation au client
            </label>
          </div>

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
                onRemove={() => setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.key !== item.key) : prev))}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
            <span className="text-sm text-gray-500 dark:text-white/60">Montant total</span>
            <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">{grandTotal.toLocaleString("fr-FR")} {currency}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Annuler</Button>
          <Button onClick={handleCreate} disabled={!isValid || saving} className="cursor-pointer">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Créer la réservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
