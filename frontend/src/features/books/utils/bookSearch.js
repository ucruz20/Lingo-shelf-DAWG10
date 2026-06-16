const normalizeSearchText = (value) => String(value ?? '').trim().toLowerCase();

function uniqueSorted(values) {
  return [
    ...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean)),
  ].sort((firstValue, secondValue) => firstValue.localeCompare(secondValue));
}

export function getBookFilterOptions(books) {
  return {
    categories: uniqueSorted(books.map((book) => book.category)),
    languages: uniqueSorted(
      books.flatMap((book) =>
        (book.translations ?? []).map((translation) => translation.languageCode?.toUpperCase()),
      ),
    ),
    levels: uniqueSorted(
      books.flatMap((book) =>
        (book.translations ?? []).map((translation) => translation.cefrLevel?.toUpperCase()),
      ),
    ),
  };
}

export function bookMatchesSearch(book, searchTerm) {
  const normalizedSearch = normalizeSearchText(searchTerm);

  if (!normalizedSearch) return true;

  const searchableValues = [
    book.author,
    book.isbn,
    book.category,
    book.publishedDate,
    ...(book.translations ?? []).flatMap((translation) => [
      translation.title,
      translation.description,
      translation.languageCode,
      translation.cefrLevel,
    ]),
  ];

  return searchableValues.some((value) => normalizeSearchText(value).includes(normalizedSearch));
}

export function bookMatchesFilters(book, filters) {
  const category = normalizeSearchText(filters.category);
  const language = normalizeSearchText(filters.language);
  const level = normalizeSearchText(filters.level);
  const translations = book.translations ?? [];

  const matchesCategory = !category || normalizeSearchText(book.category) === category;
  const matchesLanguage =
    !language ||
    translations.some((translation) => normalizeSearchText(translation.languageCode) === language);
  const matchesLevel =
    !level || translations.some((translation) => normalizeSearchText(translation.cefrLevel) === level);

  return matchesCategory && matchesLanguage && matchesLevel;
}
