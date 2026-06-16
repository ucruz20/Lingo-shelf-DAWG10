export function getBookDisplayTitle(book) {
  const translatedTitle = book.translations?.find((translation) => translation.title)?.title;

  return translatedTitle || 'Sin titulo';
}

export function formatBookPrice(price) {
  const amount = Number(price);

  if (Number.isNaN(amount)) return '$0.00';

  return `$${amount.toFixed(2)}`;
}
