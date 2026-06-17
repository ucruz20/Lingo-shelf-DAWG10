const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'es-SV';

function normalizeText(value) {
  return String(value ?? '').trim();
}

export function getBookKey(book) {
  return String(book?.id ?? book?.isbn ?? getBookDisplayTitle(book));
}

export function getBookTranslations(book) {
  return Array.isArray(book?.translations) ? book.translations : [];
}

export function getBookDisplayTitle(book) {
  const translatedTitle = getBookTranslations(book).find((translation) =>
    normalizeText(translation.title),
  )?.title;

  return translatedTitle || 'Sin titulo';
}

export function getBookDescription(book) {
  const description = getBookTranslations(book).find((translation) =>
    normalizeText(translation.description),
  )?.description;

  return description || 'Material listo para sumar a tu ruta de aprendizaje.';
}

export function getBookLanguageCodes(book) {
  return [
    ...new Set(
      getBookTranslations(book)
        .map((translation) => normalizeText(translation.languageCode).toUpperCase())
        .filter(Boolean),
    ),
  ];
}

export function getBookLanguageSummary(book) {
  const languageCodes = getBookLanguageCodes(book);
  return languageCodes.length ? languageCodes.join(' / ') : 'Idioma flexible';
}

export function getBookLevelSummary(book) {
  const levels = [
    ...new Set(
      getBookTranslations(book)
        .map((translation) => normalizeText(translation.cefrLevel).toUpperCase())
        .filter(Boolean),
    ),
  ];

  return levels.length ? levels.join(' / ') : 'Nivel flexible';
}

export function getBookProductType(book) {
  const category = normalizeText(book?.category);
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes('audio')) return 'Audiolibro';
  if (normalizedCategory.includes('didactico') || normalizedCategory.includes('curso')) {
    return 'Material didactico';
  }
  if (normalizedCategory.includes('traduc')) return 'Traduccion';
  if (normalizedCategory.includes('original')) return 'Obra original';
  if (normalizedCategory.includes('lectura')) return 'Lectura guiada';

  return category || 'Libro';
}

export function getPopularBooks(books, limit = 4) {
  return [...books]
    .sort((firstBook, secondBook) => getPopularityScore(secondBook) - getPopularityScore(firstBook))
    .slice(0, limit);
}

export function getCartQuantity(cartItems) {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(books, cartItems) {
  return cartItems.reduce((total, item) => {
    const book = books.find((currentBook) => getBookKey(currentBook) === item.bookKey);
    return total + Number(book?.price ?? 0) * item.quantity;
  }, 0);
}

export function formatBookPrice(price) {
  const amount = Number(price);

  if (Number.isNaN(amount)) return '$0.00';

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    currency: DEFAULT_CURRENCY,
    style: 'currency',
  }).format(amount);
}

function getPopularityScore(book) {
  const translatedTitleLength = getBookDisplayTitle(book).length;
  const translationBonus = getBookTranslations(book).length * 8;
  const categoryBonus = normalizeText(book.category).length;

  return Number(book.popularity ?? 0) + translationBonus + categoryBonus + translatedTitleLength / 10;
}
