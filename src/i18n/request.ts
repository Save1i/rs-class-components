import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import enMessages from '../messages/en.json';
import ruMessages from '../messages/ru.json';

const messagesByLocale = {
  en: enMessages,
  ru: ruMessages
} as const;

export default getRequestConfig(async ({requestLocale}) => {
  const requestedLocale = await requestLocale;
  const locale = routing.locales.includes(requestedLocale as (typeof routing.locales)[number])
    ? (requestedLocale as (typeof routing.locales)[number])
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale]
  };
});
