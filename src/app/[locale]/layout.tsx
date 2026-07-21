import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import Header from '../../components/Header';
import { Metadata } from 'next';
import enMessages from '../../messages/en.json';
import ruMessages from '../../messages/ru.json';

export const metadata: Metadata = {
  title: 'React 2026 Q2',
  description: 'My App for RS School course',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = locale === 'ru' ? ruMessages : enMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      {children}
    </NextIntlClientProvider>
  );
}
