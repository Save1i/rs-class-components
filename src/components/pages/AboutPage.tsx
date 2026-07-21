import {getTranslations} from 'next-intl/server';

async function AboutPage() {
  const t = await getTranslations('AboutPage');

  return (
    <section className="about-page">
      <h1 className="title">{t('title')}</h1>
      <p className="description-text">
        {t('author')}{' '}
        <a href="https://github.com/Save1i" target="_blank" rel="noreferrer">
          Saveli
        </a>
      </p>
      <p className="about-text">
        {t('course')}{' '}
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">
          RS School React Course
        </a>
      </p>
    </section>
  );
}

export default AboutPage;
