import {redirect} from 'next/navigation';
import {defaultLocale} from '../config';

export default function Page() {
  redirect(`/${defaultLocale}`);
}
