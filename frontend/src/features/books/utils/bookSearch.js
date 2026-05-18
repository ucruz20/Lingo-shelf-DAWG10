const normalizeSearchText = (value) => String(value ?? '').trim().toLowerCase();

export function bookMatchesSearch(book, searchTerm) {
  const normalizedSearch = normalizeSearchText(searchTerm);

  if (!normalizedSearch) return true;

  const searchableValues = [
    book.title,
    book.isbn,
    book.category,
    ...(book.translations ?? []).flatMap((translation) => [
      translation.title,
      translation.description,
      translation.languageCode,
    ]),
  ];

  return searchableValues.some((value) => normalizeSearchText(value).includes(normalizedSearch));
}
