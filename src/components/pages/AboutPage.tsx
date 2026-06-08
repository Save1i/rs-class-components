function AboutPage() {
  return (
    <section className="about-page">
      <h1 className="title">About</h1>
      <p className="description-text">
        Author:{' '}
        <a href="https://github.com/Save1i" target="_blank" rel="noreferrer">
          Saveli
        </a>
      </p>
      <p className="about-text">
        Course:{' '}
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">
          RS School React Course
        </a>
      </p>
    </section>
  );
}

export default AboutPage;
