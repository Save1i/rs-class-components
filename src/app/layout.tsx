import '../index.css';
import { Metadata } from 'next';
import {getLocale} from 'next-intl/server';
import { ClientOnly } from './client';

export const metadata: Metadata = {
  title: 'React 2026 Q2',
  description: 'My App for RS School course',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <ClientOnly>
          <div id="root">
            {children}
          </div>
        </ClientOnly>
      </body>
    </html>
  );
}
