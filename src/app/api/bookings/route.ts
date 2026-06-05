import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      suiteId,
      checkIn,
      checkOut,
      guests,
      experiences,
      specialReqs,
      totalAmount,
    } = body;

    if (!firstName || !lastName || !email || !suiteId || !checkIn || !checkOut) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await db.booking.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        suiteId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: guests || 2,
        experiences: experiences || null,
        specialReqs: specialReqs || null,
        totalAmount: totalAmount || 0,
        status: "pending",
      },
      include: { suite: true },
    });

    return Response.json({ success: true, booking }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
