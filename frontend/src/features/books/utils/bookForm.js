export function createEmptyTranslation() {
  return {
    languageCode: '',
    title: '',
    description: '',
  };
}

export function createEmptyBookForm() {
  return {
    isbn: '',
    price: '',
    mcer: '',
    category: '',
    title: '',
    translations: [createEmptyTranslation()],
  };
}

export function cloneBookForForm(book) {
  return {
    ...createEmptyBookForm(),
    ...book,
    price: book.price ?? '',
    translations: book.translations?.length
      ? book.translations.map((translation) => ({ ...translation }))
      : [createEmptyTranslation()],
  };
}

export function normalizeBookForm(formData) {
  const price = Number.parseFloat(formData.price);

  return {
    ...formData,
    isbn: formData.isbn.trim(),
    price: Number.isNaN(price) ? 0 : price,
    mcer: formData.mcer.trim(),
    category: formData.category.trim(),
    title: formData.title.trim(),
    translations: formData.translations.map((translation) => ({
      languageCode: translation.languageCode.trim(),
      title: translation.title.trim(),
      description: translation.description.trim(),
    })),
  };
}
