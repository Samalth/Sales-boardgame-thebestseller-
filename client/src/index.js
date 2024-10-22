import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import global_en from './Translations/en/global.json';
import global_nl from './Translations/nl/global.json';
import global_dk from './Translations/dk/global.json';
import i18next from "i18next";
import { initReactI18next } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import { LanguageManagerProvider } from './Translations/LanguageManager';
import reportWebVitals from './reportWebVitals';

// Initialize i18next
i18next
    .use(initReactI18next)
    .init({
        lng: 'en',
        resources: {
            en: {
                global: global_en
            },
            nl: {
                global: global_nl
            },
            dk: {
                global: global_dk
            }
        }
    }).then(r => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <LanguageManagerProvider>
            <I18nextProvider i18n={i18next}>
                <App />
            </I18nextProvider>
        </LanguageManagerProvider>
    );
});



reportWebVitals();
