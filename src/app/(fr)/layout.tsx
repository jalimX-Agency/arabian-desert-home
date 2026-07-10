import { LanguageProvider } from "@/lib/i18n/context";
import { faqSchemaFr, lodgingSchemaFr } from "@/lib/seo/schema";

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = JSON.stringify(faqSchemaFr);
  const lodgingSchema = JSON.stringify(lodgingSchemaFr);

  return (
    <LanguageProvider initialLanguage="fr" locked>
      <script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: lodgingSchema }} />
      {children}
    </LanguageProvider>
  );
}
