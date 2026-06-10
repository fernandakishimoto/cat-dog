import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptJson from '@/translations/pt.json';

const resources = {
  pt: {
    AUTH_LOGIN: ptJson.AUTH_LOGIN,
    AUTH_REGISTER: ptJson.AUTH_REGISTER,
    ADMIN_SOLICITACOES: ptJson.ADMIN_SOLICITACOES,
    ADMIN_LAYOUT: ptJson.ADMIN_LAYOUT,
  },
};

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: 'pt',
    fallbackLng: 'pt',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18next;
