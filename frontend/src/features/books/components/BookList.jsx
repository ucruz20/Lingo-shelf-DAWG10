import {
  formatBookPrice,
  getBookDescription,
  getBookKey,
  getBookLanguageSummary,
  getBookLevelSummary,
  getBookProductType,
  getBookDisplayTitle,
} from '../utils/bookDisplay.js';

export default function BookList({
  books,
  canManageInventory,
  cartItems,
  isFiltered,
  onAddToCart,
  onEdit,
  onToggleWishlist,
  variant = 'catalog',
  wishlistIds,
}) {
  if (books.length === 0) {
    return (
      <p className="books-empty">
        {isFiltered ? 'No se encontraron libros.' : 'Todavia no hay libros registrados.'}
      </p>
    );
  }

  return (
    <section className={`books-list books-list-${variant}`} aria-label="Libros">
      {books.map((book) => {
        const bookKey = getBookKey(book);
        const isInWishlist = wishlistIds.includes(bookKey);
        const cartItem = cartItems.find((item) => item.bookKey === bookKey);

        return (
          <article key={bookKey} className="book-card">
            <div className="book-cover" aria-hidden="true">
              <span>{getBookLanguageSummary(book).split(' ')[0]}</span>
            </div>

            <div className="book-info">
              <div className="book-meta-row">
                <span className="book-pill">{getBookProductType(book)}</span>
                <span>{getBookLevelSummary(book)}</span>
              </div>

              <h3 className="book-title">{getBookDisplayTitle(book)}</h3>
              <p className="book-author">{book.author}</p>
              <p className="book-description">{getBookDescription(book)}</p>

              <div className="book-details">
                <span>{getBookLanguageSummary(book)}</span>
                <span>ISBN {book.isbn}</span>
                <span>{book.publishedDate}</span>
              </div>
            </div>

            <div className="book-actions">
              <p className="book-price">{formatBookPrice(book.price)}</p>

              <button
                className={isInWishlist ? 'btn-wishlist active' : 'btn-wishlist'}
                onClick={() => onToggleWishlist(book)}
              >
                {isInWishlist ? 'Guardado' : 'Wishlist'}
              </button>

              <button className="btn-cart" onClick={() => onAddToCart(book)}>
                {cartItem ? `En carrito (${cartItem.quantity})` : 'Agregar'}
              </button>

              {canManageInventory && (
                <button className="btn-edit" onClick={() => onEdit(book)}>
                  Editar
                </button>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
