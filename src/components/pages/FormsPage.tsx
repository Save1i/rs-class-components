import { useEffect, useRef, useState } from 'react';
import Modal from '../Modal';
import ControlledForm from '../forms/ControlledForm';
import UncontrolledForm from '../forms/UncontrolledForm';
import { useFormsStore } from '../../store/formsStore';
import type { FormKind, FormSubmission } from '../../types/forms';

function FormsPage() {
  const countries = useFormsStore((state) => state.countries);
  const submissions = useFormsStore((state) => state.submissions);
  const addSubmission = useFormsStore((state) => state.addSubmission);
  const [openForm, setOpenForm] = useState<FormKind | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!openForm) {
      lastTriggerRef.current?.focus();
    }
  }, [openForm]);

  useEffect(() => {
    if (!highlightedId) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setHighlightedId(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [highlightedId]);

  const handleFormSuccess = (submission: FormSubmission) => {
    addSubmission(submission);
    setHighlightedId(submission.id);
  };

  const openModal = (formKind: FormKind, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setOpenForm(formKind);
  };

  return (
    <main className="forms-page">
      <section className="forms-header">
        <h1 className="title">Forms</h1>
        <p className="description-text">
          Simple profile forms with image upload, password validation, and country autocomplete.
        </p>
        <div className="search-actions">
          <button className="search-button" type="button" onClick={(event) => openModal('uncontrolled', event.currentTarget)}>
            Open uncontrolled form
          </button>
          <button className="search-button" type="button" onClick={(event) => openModal('hook-form', event.currentTarget)}>
            Open RHF form
          </button>
        </div>
      </section>

      <section className="forms-block">
        <div className="section-header">
          <h2 className="section-title">Submissions</h2>
          <p className="section-note">{submissions.length} saved profile(s)</p>
        </div>

        {submissions.length === 0 ? (
          <div className="card">
            <p className="text-info">No submissions yet. Open a form and submit valid data.</p>
          </div>
        ) : (
          <div className="card-list__content forms-grid">
            {submissions.map((submission) => (
              <article
                key={submission.id}
                className={`card submission-card ${highlightedId === submission.id ? 'submission-card--highlighted' : ''}`}
              >
                <div className="card-image__wrapper">
                  <img className="card-image" src={submission.imageSrc} alt={submission.imageName} />
                </div>
                <h3 className="card-name">{submission.name}</h3>
                <div className="card-info">
                  <p className="card-text">Country: {submission.country}</p>
                  <p className="card-text">Password: {submission.passwordStrengthLabel}</p>
                  <p className="card-text">{submission.formKind === 'hook-form' ? 'React Hook Form' : 'Uncontrolled'}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {openForm && (
        <Modal title={openForm === 'hook-form' ? 'React Hook Form' : 'Uncontrolled form'} onClose={() => setOpenForm(null)}>
          {openForm === 'hook-form' ? (
            <ControlledForm countries={countries} onClose={() => setOpenForm(null)} onSubmitSuccess={handleFormSuccess} />
          ) : (
            <UncontrolledForm countries={countries} onClose={() => setOpenForm(null)} onSubmitSuccess={handleFormSuccess} />
          )}
        </Modal>
      )}
    </main>
  );
}

export default FormsPage;
