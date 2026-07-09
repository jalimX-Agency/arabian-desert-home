import { LanguageProvider } from "@/lib/i18n/context";
import { faqSchemaIt, lodgingSchemaIt } from "@/lib/seo/schema";

export default function ItalianLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = JSON.stringify(faqSchemaIt);
  const lodgingSchema = JSON.stringify(lodgingSchemaIt);

  return (
    <LanguageProvider initialLanguage="it" locked>
      <script id="faq-schema-it" type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script id="structured-data-it" type="application/ld+json" dangerouslySetInnerHTML={{ __html: lodgingSchema }} />
      {children}
    </LanguageProvider>
  );
}
