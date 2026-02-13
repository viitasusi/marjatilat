import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fi from './locales/fi.json';
import sv from './locales/sv.json';
import en from './locales/en.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            fi: { translation: fi },
            sv: { translation: sv },
            en: { translation: en }
        },
        lng: 'fi', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
