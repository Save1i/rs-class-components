import {getTranslations} from 'next-intl/server';
import {Link} from '../../i18n/navigation';

async function NotFoundPage() {
  const t = await getTranslations('NotFound');

  return (
    <section className="not-found__page">
      <h1 className="title">{t('title')}</h1>
      <p className="about-text">{t('message')}</p>
      <Link className="search-button back-button" href="/">
        {t('back')}
      </Link>
    </section>
  );
}

export default NotFoundPage;
