import '../index.css';
import { Metadata } from 'next';
import Header from '../components/Header';
import { ClientOnly } from './client';

export const metadata: Metadata = {
  title: 'React 2026 Q2',
  description: 'My App for RS School course',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientOnly>
          <div id="root">
            <Header />
            {children}
          </div>
        </ClientOnly>
      </body>
    </html>
  );
}