import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split('/')[1];
  
  // Проверяем, валидная ли локаль
  const isValidLocale = routing.locales.includes(locale as any);
  
  // Если локаль невалидна и это не статика/апи
  if (!isValidLocale && locale) {
    // Редирект на not-found
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
  
  // Если локаль валидна или отсутствует - используем next-intl middleware
  return intlMiddleware(request);
}



export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
