import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../Translations/en/global.json'; // Adjust paths as necessary
import translationDK from '../Translations/dk/global.json';
import translationNL from '../Translations/nl/global.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { global: translationEN },
            dk: { global: translationDK },
            nl: { global: translationNL },
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;