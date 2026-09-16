import { revalidatePath } from "next/cache";

const LOCALE_PREFIXES = ["", "/en", "/es", "/it"];

/** Revalidates a site-relative path (e.g. "/les-activites/foo") across all 4 locale route groups. */
export function revalidateLocalized(path: string): void {
  for (const prefix of LOCALE_PREFIXES) {
    revalidatePath(`${prefix}${path}`);
  }
}

/** Revalidates several site-relative paths across all 4 locale route groups. */
export function revalidateLocalizedMany(paths: string[]): void {
  for (const path of paths) revalidateLocalized(path);
}
