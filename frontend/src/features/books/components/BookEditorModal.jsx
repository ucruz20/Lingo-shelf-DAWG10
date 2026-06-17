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

  const removeTranslationField = (index) => {
    setFormData((currentForm) => ({
      ...currentForm,
      translations: currentForm.translations.filter((_, translationIndex) => translationIndex !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(normalizeBookForm(formData));
  };

  return (
    <div className="modal-overlay">
      <section className="modal-content" role="dialog" aria-modal="true" aria-labelledby="book-editor-title">
        <div className="modal-heading">
          <div>
            <p className="section-kicker">Inventario</p>
            <h2 id="book-editor-title">{isEditing ? 'Editar libro' : 'Agregar libro'}</h2>
          </div>

          <button type="button" onClick={onClose} className="btn-icon" aria-label="Cerrar modal">
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <div className="form-grid">
            <label className="form-group" htmlFor="book-isbn">
              ISBN
              <input
                id="book-isbn"
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="form-group" htmlFor="book-author">
              Autor
              <input
                id="book-author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="form-group" htmlFor="book-category">
              Categoria
              <input
                id="book-category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleFieldChange}
                placeholder="Audiolibro, Material didactico..."
                required
              />
            </label>

            <label className="form-group" htmlFor="book-publishedDate">
              Publicacion
              <input
                id="book-publishedDate"
                type="date"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="form-group" htmlFor="book-price">
              Precio
              <input
                id="book-price"
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleFieldChange}
                required
              />
            </label>
          </div>

          <div className="translations-heading">
            <h3>Traducciones disponibles</h3>
            <button type="button" onClick={addTranslationField} className="btn-secondary">
              Anadir traduccion
            </button>
          </div>

          {formData.translations.map((translation, index) => (
            <fieldset key={translation.formId} className="translation-block">
              <legend>Idioma #{index + 1}</legend>

              <div className="form-grid">
                <label className="form-group" htmlFor={`translation-language-${index}`}>
                  Codigo
                  <input
                    id={`translation-language-${index}`}
                    type="text"
                    value={translation.languageCode}
                    onChange={(event) =>
                      handleTranslationChange(index, 'languageCode', event.target.value)
                    }
                    placeholder="es, en, fr"
                    required
                  />
                </label>

                <label className="form-group" htmlFor={`translation-title-${index}`}>
                  Titulo
                  <input
                    id={`translation-title-${index}`}
                    type="text"
                    value={translation.title}
                    onChange={(event) => handleTranslationChange(index, 'title', event.target.value)}
                    required
                  />
                </label>

                <label className="form-group" htmlFor={`translation-cefrlevel-${index}`}>
                  Nivel CEFR
                  <input
                    id={`translation-cefrlevel-${index}`}
                    type="text"
                    value={translation.cefrLevel}
                    onChange={(event) => handleTranslationChange(index, 'cefrLevel', event.target.value)}
                    placeholder="A1, A2, B1..."
                    required
                  />
                </label>
              </div>

              <label className="form-group" htmlFor={`translation-description-${index}`}>
                Descripcion
                <textarea
                  id={`translation-description-${index}`}
                  value={translation.description}
                  onChange={(event) =>
                    handleTranslationChange(index, 'description', event.target.value)
                  }
                  required
                />
              </label>

              {formData.translations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTranslationField(index)}
                  className="btn-remove-line"
                >
                  Quitar traduccion
                </button>
              )}
            </fieldset>
          ))}

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
