import { promises as dns } from "node:dns";

export interface EmailCheck {
  ok: boolean;
  /** Human-readable (French, admin-facing) explanation of the result. */
  message: string;
}

// Deliberately simple: one "@", no spaces, a dot in the domain. Deliverability
// is decided by the DNS lookup below, not by a clever regex.
const SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** OTA relay inboxes — mail reaches the platform, not the guest's own mailbox. */
const RELAY_DOMAINS = [/(^|\.)guest\.booking\.com$/i, /(^|\.)expediapartnercentral\.com$/i, /(^|\.)m\.expedia\.com$/i];

/** Common typos of big providers, caught before they bounce. */
const TYPO_HINTS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.co": "gmail.com", "gmal.com": "gmail.com", "gnail.com": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com",
  "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "outlok.com": "outlook.com", "icloud.co": "icloud.com",
};

/**
 * Checks that an address is well-formed and that its domain can receive mail
 * (MX record, or an A record as RFC 5321's implicit fallback). Doesn't prove
 * the mailbox itself exists — no provider allows checking that reliably.
 */
export async function checkEmailAddress(raw: string): Promise<EmailCheck> {
  const email = raw.trim();
  if (!SHAPE.test(email)) return { ok: false, message: "Adresse email invalide." };

  const domain = email.split("@")[1].toLowerCase();
  if (TYPO_HINTS[domain]) {
    return { ok: false, message: `Faute de frappe probable : « ${domain} » — vouliez-vous dire « ${TYPO_HINTS[domain]} » ?` };
  }
  if (RELAY_DOMAINS.some((r) => r.test(domain))) {
    return { ok: false, message: "Adresse relais d'une plateforme de réservation : l'email n'arriverait pas au client lui-même." };
  }

  try {
    const mx = await dns.resolveMx(domain);
    if (mx.some((r) => r.exchange && r.exchange !== ".")) {
      return { ok: true, message: `Adresse valide — le domaine ${domain} reçoit des emails.` };
    }
  } catch {
    // No MX record: fall through to the A-record fallback.
  }
  try {
    await dns.resolve4(domain);
    return { ok: true, message: `Adresse valide — le domaine ${domain} existe.` };
  } catch {
    return { ok: false, message: `Le domaine « ${domain} » n'existe pas ou ne reçoit pas d'emails.` };
  }
}
