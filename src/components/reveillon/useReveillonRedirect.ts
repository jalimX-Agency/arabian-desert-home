"use client";

import { useEffect } from "react";
import { toISODay } from "@/lib/tent-stay";
import { dayIsReveillon, reveillonHref, stayTouchesReveillon } from "@/lib/reveillon";

type Day = Date | string | null | undefined;
const iso = (d: Day) => (!d ? null : typeof d === "string" ? d : toISODay(d));

/**
 * Sends the visitor to the New Year's Eve page as soon as the dates they picked include the
 * night of 31 Dec (a stay) or fall on the 31st (a dated service): that night is sold there only.
 */
export function useReveillonRedirect(lang: string, stay: { checkIn?: Day; checkOut?: Day }, dates: Day[] = []) {
  const checkIn = iso(stay.checkIn);
  const checkOut = iso(stay.checkOut);
  const days = dates.map(iso).join(",");
  useEffect(() => {
    if (stayTouchesReveillon(checkIn, checkOut) || days.split(",").some((d) => dayIsReveillon(d))) {
      // A full navigation: pages that keep their dates in the URL would otherwise cancel a soft one.
      window.location.assign(reveillonHref(lang));
    }
  }, [lang, checkIn, checkOut, days]);
}
