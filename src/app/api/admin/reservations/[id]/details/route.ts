import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { sendReservationUpdatedEmail } from "@/lib/email";

const include = { suite: true, activity: true, dayPass: true } as const;

interface EditItem {
  id?: string;
  _delete?: boolean;
  serviceType: "suite" | "activity" | "daypass";
  suiteId?: string | null;
  activityId?: string | null;
  dayPassId?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  date?: string | null;
  quantity?: number;
  guests: number;
  children: number;
  totalAmount: number;
  currency?: string;
}

interface EditBody {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialReqs?: string | null;
    channel: string;
  };
  items: EditItem[];
}

/** Full-detail edit of a reservation — contact info, per-item dates/guests/price, add/remove items.
 *  Distinct from the status-only PATCH on the parent route, which stays untouched for the quick
 *  inline status change. Any successful edit here notifies the client by email. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const body = (await req.json()) as EditBody;
  const { contact, items } = body;

  if (!contact.firstName || !contact.lastName || !contact.email || !contact.phone) {
    return NextResponse.json({ error: "Missing required contact fields" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.filter((i) => !i._delete).length === 0) {
    return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
  }

  const currency = items.find((i) => !i._delete)?.currency ?? "MAD";
  const totalAmount = items.filter((i) => !i._delete).reduce((sum, i) => sum + i.totalAmount, 0);

  await db.$transaction(async (tx) => {
    await tx.reservation.update({
      where: { id },
      data: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        specialReqs: contact.specialReqs || null,
        channel: contact.channel,
        totalAmount,
        currency,
      },
    });

    for (const item of items) {
      if (item.id && item._delete) {
        await tx.booking.delete({ where: { id: item.id } });
        continue;
      }

      const data = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        specialReqs: contact.specialReqs || null,
        serviceType: item.serviceType,
        suiteId: item.serviceType === "suite" ? item.suiteId ?? null : null,
        activityId: item.serviceType === "activity" ? item.activityId ?? null : null,
        dayPassId: item.serviceType === "daypass" ? item.dayPassId ?? null : null,
        checkIn: item.checkIn ? new Date(item.checkIn) : null,
        checkOut: item.checkOut ? new Date(item.checkOut) : null,
        date: item.date ? new Date(item.date) : null,
        quantity: Math.max(1, item.quantity ?? 1),
        guests: item.guests,
        children: item.children,
        totalAmount: item.totalAmount,
        currency: item.currency ?? "MAD",
      };

      if (item.id) {
        await tx.booking.update({ where: { id: item.id }, data });
      } else {
        await tx.booking.create({ data: { ...data, reservationId: id, status: "pending" } });
      }
    }
  });

  const freshItems = await db.booking.findMany({
    where: { reservationId: id },
    include,
    orderBy: { createdAt: "asc" },
  });

  try {
    await sendReservationUpdatedEmail(contact.email, contact.firstName, freshItems, totalAmount, currency);
  } catch (err) {
    console.error("Failed to send reservation-updated email:", err);
  }

  return NextResponse.json({ items: freshItems });
}
