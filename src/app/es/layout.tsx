import { LanguageProvider } from "@/lib/i18n/context";
import { faqSchemaEs, lodgingSchemaEs } from "@/lib/seo/schema";

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = JSON.stringify(faqSchemaEs);
  const lodgingSchema = JSON.stringify(lodgingSchemaEs);

  return (
    <LanguageProvider initialLanguage="es" locked>
      <script id="faq-schema-es" type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script id="structured-data-es" type="application/ld+json" dangerouslySetInnerHTML={{ __html: lodgingSchema }} />
      {children}
    </LanguageProvider>
  );
}
