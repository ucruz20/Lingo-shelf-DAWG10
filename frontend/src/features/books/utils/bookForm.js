function createFormId() {
  return `translation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyTranslation() {
  return {
    formId: createFormId(),
    languageCode: '',
    title: '',
    description: '',
    cefrLevel: '',
  };
}

export function createEmptyBookForm() {
  return {
    isbn: '',
    price: '',
    author: '',
    category: '',
    publishedDate: '',
    translations: [createEmptyTranslation()],
  };
}

export function cloneBookForForm(book) {
  return {
    ...createEmptyBookForm(),
    isbn: book.isbn ?? '',
    price: book.price ?? '',
    author: book.author ?? '',
    category: book.category ?? '',
    publishedDate: book.publishedDate ?? '',
    translations: book.translations?.length
      ? book.translations.map((translation) => ({
          ...translation,
          formId: translation.formId ?? createFormId(),
        }))
      : [createEmptyTranslation()],
  };
}

export function normalizeBookForm(formData) {
  const price = Number.parseFloat(formData.price);

  return {
    isbn: formData.isbn.trim(),
    price: Number.isNaN(price) ? 0 : price,
    author: formData.author.trim(),
    category: formData.category.trim(),
    publishedDate: formData.publishedDate.trim(),
    translations: formData.translations.map((translation) => ({
      languageCode: translation.languageCode.trim(),
      title: translation.title.trim(),
      description: translation.description.trim(),
      cefrLevel: translation.cefrLevel.trim(),
    })),
  };
}
