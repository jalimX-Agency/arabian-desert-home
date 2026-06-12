import { db } from "@/lib/db";
import { sendContactConfirmation, sendContactNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.contactMessage.create({
      data: { name, email, subject, message },
    });

    Promise.allSettled([
      sendContactConfirmation(email, name, subject),
      sendContactNotification(name, email, subject, message),
    ]);

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
