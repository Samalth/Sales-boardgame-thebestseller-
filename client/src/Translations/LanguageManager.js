import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { socket } from '../client';

const LanguageManagerContext = createContext();

export const LanguageManagerProvider = ({ children }) => {
    const { i18n } = useTranslation('global');
    const [language, setLanguage] = useState('en');

    const handleChangeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
        socket.emit('change_language', lng);
    };

    const handleGuide = () => {
        const guideMapping = {
            en: '/GuideEN.pdf',
            nl: '/GuideNL.pdf',
            dk: '/GuideDK.pdf',
        };
        const pdfPath = guideMapping[language];
        window.open(pdfPath, '_blank');
    };

    return (
        <LanguageManagerContext.Provider value={{ language, handleChangeLanguage, handleGuide }}>
            {children}
        </LanguageManagerContext.Provider>
    );
};

export const useLanguageManager = () => useContext(LanguageManagerContext);
