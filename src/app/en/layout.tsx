import { LanguageProvider } from "@/lib/i18n/context";
import { faqSchemaEn, lodgingSchemaEn } from "@/lib/seo/schema";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = JSON.stringify(faqSchemaEn);
  const lodgingSchema = JSON.stringify(lodgingSchemaEn);

  return (
    <LanguageProvider initialLanguage="en" locked>
      <script id="faq-schema-en" type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script id="structured-data-en" type="application/ld+json" dangerouslySetInnerHTML={{ __html: lodgingSchema }} />
      {children}
    </LanguageProvider>
  );
}
