import { useState } from 'react';
import {
  cloneBookForForm,
  createEmptyBookForm,
  createEmptyTranslation,
  normalizeBookForm,
} from '../utils/bookForm.js';

export default function BookEditorModal({
  book,
  errorMessage,
  onClose,
  onDelete,
  onSave,
}) {
  const [formData, setFormData] = useState(() =>
    book ? cloneBookForForm(book) : createEmptyBookForm(),
  );

  const isEditing = Boolean(book);

  const handleFieldChange = ({ target }) => {
    const { name, value } = target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleTranslationChange = (index, field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      translations: currentForm.translations.map((translation, translationIndex) =>
        translationIndex === index
          ? { ...translation, [field]: value }
          : translation,
      ),
    }));
  };

  const addTranslationField = () => {
    setFormData((currentForm) => ({
      ...currentForm,
      translations: [...currentForm.translations, createEmptyTranslation()],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(normalizeBookForm(formData));
  };

  return (
    <div className="modal-overlay">
      <section className="modal-content" role="dialog" aria-modal="true" aria-labelledby="book-editor-title">
        <h2 id="book-editor-title">{isEditing ? 'Editar libro' : 'Agregar nuevo libro'}</h2>

        <form onSubmit={handleSubmit}>
          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <div className="form-group">
            <label htmlFor="book-title">Titulo:</label>
            <input
              id="book-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-isbn">ISBN:</label>
            <input
              id="book-isbn"
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-level">MCER:</label>
            <input
              id="book-level"
              type="text"
              name="mcer"
              value={formData.mcer}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-category">Categoria:</label>
            <input
              id="book-category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-price">Precio:</label>
            <input
              id="book-price"
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleFieldChange}
              required
            />
          </div>

          <h3>Traducciones</h3>

          {formData.translations.map((translation, index) => (
            <div key={`${translation.languageCode}-${index}`} className="translation-block">
              <h4>Idioma #{index + 1}</h4>

              <div className="form-group">
                <label htmlFor={`translation-language-${index}`}>Codigo de idioma:</label>
                <input
                  id={`translation-language-${index}`}
                  type="text"
                  value={translation.languageCode}
                  onChange={(event) =>
                    handleTranslationChange(index, 'languageCode', event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`translation-title-${index}`}>Titulo:</label>
                <input
                  id={`translation-title-${index}`}
                  type="text"
                  value={translation.title}
                  onChange={(event) => handleTranslationChange(index, 'title', event.target.value)}
                  required
                />
              </div>

              <div className="form-group form-group-with-textarea">
                <label htmlFor={`translation-description-${index}`}>Descripcion:</label>
                <textarea
                  id={`translation-description-${index}`}
                  value={translation.description}
                  onChange={(event) =>
                    handleTranslationChange(index, 'description', event.target.value)
                  }
                  required
                />
              </div>
            </div>
          ))}

          <button type="button" onClick={addTranslationField} className="btn-secondary">
            + Anadir traduccion
          </button>

          <div className="modal-actions">
            {isEditing && (
              <button type="button" onClick={onDelete} className="btn-delete">
                Eliminar
              </button>
            )}

            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {isEditing ? 'Guardar cambios' : 'Crear libro'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
