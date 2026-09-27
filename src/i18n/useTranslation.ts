import { useState, useEffect } from 'react';
import { SupportedLanguage, TRANSLATIONS, TranslationDictionary, SUPPORTED_LANGUAGES, LanguageMeta } from './translations';

export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('n_help_lang');
    return (saved as SupportedLanguage) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('n_help_lang', lang);
  }, [lang]);

  const t: TranslationDictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const currentLanguageMeta: LanguageMeta = 
    SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return {
    lang,
    setLang,
    t,
    currentLanguageMeta,
    supportedLanguages: SUPPORTED_LANGUAGES
  };
}
