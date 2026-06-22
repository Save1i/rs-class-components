import '../index.css';
import {getLocale} from 'next-intl/server';
import { ClientOnly } from './client';

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
