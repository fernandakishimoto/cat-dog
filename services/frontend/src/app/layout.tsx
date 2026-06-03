import type { Metadata } from 'next';

import I18nProvider from '@/components/I18nProvider/I18nProvider';

export const metadata: Metadata = {
  title: 'CatDog',
  description: 'Plataforma de adoção de animais',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
