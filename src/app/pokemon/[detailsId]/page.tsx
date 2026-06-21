import {redirect} from 'next/navigation';
import {defaultLocale} from '../../../config';

export default async function Page({params}: {params: Promise<{detailsId: string}>}) {
  const {detailsId} = await params;
  redirect(`/${defaultLocale}/pokemon/${detailsId}`);
}
