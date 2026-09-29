import { useEffect, useRef, useState } from 'react';
import { UserRound, ArrowRight, X } from 'lucide-react';
import { getGreeting } from '../utils/greeting';
import { MAX_NAME_LENGTH, isValidUserName } from '../utils/userName';
import './PersonalizationCard.css';

function PersonalizationCard({ userName, onUserNameChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(userName);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const openEditor = () => {
    setDraftName(userName);
    setError('');
    setIsEditing(true);
  };

  const closeEditor = () => setIsEditing(false);

  useEffect(() => {
    if (isEditing) {
      // Wait for the modal's mount transition so autofocus doesn't steal the scroll position.
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeEditor();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isEditing]);

  const handleSave = () => {
    if (!isValidUserName(draftName)) {
      setError('Please enter a name before saving.');
      return;
    }
    onUserNameChange(draftName);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setDraftName(e.target.value.slice(0, MAX_NAME_LENGTH));
    if (error) setError('');
  };

  const previewName = draftName.trim() || userName;
  const greeting = getGreeting(new Date().getHours());

  return (
    <>
      <div className="personalization-card">
        <div className="personalization-card__icon">
          <UserRound size={18} />
        </div>

        <div className="personalization-card__body">
          <h4 className="personalization-card__title">Personalization</h4>
          <p className="personalization-card__label">Your name</p>
          <p className="personalization-card__name">{userName}</p>
          <p className="personalization-card__hint">Customize how Weather greets you</p>
        </div>

        <button type="button" className="personalization-card__edit" onClick={openEditor}>
          Edit
          <ArrowRight size={15} />
        </button>
      </div>

      {isEditing && (
        <div
          className="name-editor-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEditor();
          }}
        >
          <div
            className="name-editor"
            role="dialog"
            aria-modal="true"
            aria-labelledby="name-editor-title"
          >
            <div className="name-editor__header">
              <h3 id="name-editor-title">Edit your name</h3>
              <button
                type="button"
                className="name-editor__close"
                onClick={closeEditor}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <label className="name-editor__field">
              <span className="name-editor__field-label">Your name</span>
              <input
                ref={inputRef}
                type="text"
                className={`name-editor__input ${error ? 'has-error' : ''}`}
                value={draftName}
                onChange={handleChange}
                maxLength={MAX_NAME_LENGTH}
                placeholder="Enter your name"
                aria-invalid={!!error}
                aria-describedby={error ? 'name-editor-error' : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
              />
              <span className="name-editor__counter">
                {draftName.length}/{MAX_NAME_LENGTH}
              </span>
            </label>

            {error && (
              <p id="name-editor-error" className="name-editor__error">
                {error}
              </p>
            )}

            <div className="name-editor__preview">
              <p className="name-editor__preview-label">Preview</p>
              <p className="name-editor__preview-greeting">{greeting},</p>
              <p className="name-editor__preview-name">{previewName}</p>
            </div>

            <div className="name-editor__actions">
              <button type="button" className="name-editor__cancel" onClick={closeEditor}>
                Cancel
              </button>
              <button type="button" className="name-editor__save" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PersonalizationCard;
