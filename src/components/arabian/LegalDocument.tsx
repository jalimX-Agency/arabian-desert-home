import type { Fact } from "@/lib/company";

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
  /** Label / value pairs (used for the company identification block). */
  facts?: Fact[];
}

export interface LegalCopy {
  title: string;
  intro: string;
  sections: LegalSection[];
  updated: string;
}

/** Shared layout of the legal pages (privacy policy, terms and conditions). */
export function LegalDocument({ copy }: { copy: LegalCopy }) {
  return (
    <article className="px-6 md:px-10 pt-36 md:pt-44 pb-20 md:pb-28">
      <div className="max-w-3xl mx-auto">
        <h1 className="heading-display text-3xl md:text-5xl mb-6">{copy.title}</h1>
        <div className="divider-accent max-w-[80px] mb-8" />
        <p className="body-editorial text-lg text-muted-foreground leading-relaxed mb-12">{copy.intro}</p>

        <div className="space-y-10">
          {copy.sections.map((s, i) => (
            <section key={s.title}>
              <h2 className="heading-editorial text-xl md:text-2xl mb-4">
                <span className="text-amber/70 mr-2">{i + 1}.</span>
                {s.title}
              </h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className="body-editorial text-muted-foreground leading-relaxed mb-4">
                  {p}
                </p>
              ))}
              {s.facts && (
                <dl className="mb-4 divide-y divide-border/40 rounded-2xl border border-border/50 bg-background/50">
                  {s.facts.map((f) => (
                    <div key={f.label} className="grid gap-1 px-5 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground/70">{f.label}</dt>
                      <dd className="text-sm text-foreground/90 break-words">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {s.list && (
                <ul className="space-y-3">
                  {s.list.map((item) => (
                    <li key={item} className="flex gap-3 body-editorial text-muted-foreground leading-relaxed">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-14 text-xs text-muted-foreground/60">{copy.updated}</p>
      </div>
    </article>
  );
}
