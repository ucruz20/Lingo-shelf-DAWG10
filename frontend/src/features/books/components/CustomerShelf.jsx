import {
  formatBookPrice,
  getBookDisplayTitle,
  getBookKey,
} from '../utils/bookDisplay.js';

export default function CustomerShelf({
  cartItems,
  cartTotal,
  checkoutMessage,
  onAddToCart,
  onCheckout,
  onQuantityChange,
  onRemoveFromCart,
  onRemoveWishlist,
  session,
  wishlistBooks,
  books,
}) {
  const cartBooks = cartItems
    .map((item) => ({
      ...item,
      book: books.find((book) => getBookKey(book) === item.bookKey),
    }))
    .filter((item) => item.book);

  return (
    <section className="customer-shelf" aria-label="Lista de deseos y carrito">
      <div className="shelf-section">
        <div className="section-title-row">
          <div>
            <p className="section-kicker">Wishlist</p>
            <h2>Guardados</h2>
          </div>
          <span>{wishlistBooks.length}</span>
        </div>

        {wishlistBooks.length > 0 ? (
          <div className="compact-list">
            {wishlistBooks.map((book) => (
              <article key={getBookKey(book)} className="compact-item">
                <div>
                  <strong>{getBookDisplayTitle(book)}</strong>
                  <span>{formatBookPrice(book.price)}</span>
                </div>
                <div className="compact-actions">
                  <button type="button" className="btn-mini" onClick={() => onAddToCart(book)}>
                    Agregar
                  </button>
                  <button
                    type="button"
                    className="btn-mini ghost"
                    onClick={() => onRemoveWishlist(book)}
                  >
                    Quitar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="panel-empty">No hay libros guardados.</p>
        )}
      </div>

      <div className="shelf-section">
        <div className="section-title-row">
          <div>
            <p className="section-kicker">Carrito</p>
            <h2>Compra</h2>
          </div>
          <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
        </div>

        {cartBooks.length > 0 ? (
          <div className="cart-list">
            {cartBooks.map(({ book, bookKey, quantity }) => (
              <article key={bookKey} className="cart-item">
                <div>
                  <strong>{getBookDisplayTitle(book)}</strong>
                  <span>{formatBookPrice(book.price)}</span>
                </div>

                <div className="quantity-control" aria-label={`Cantidad de ${getBookDisplayTitle(book)}`}>
                  <button
                    type="button"
                    className="btn-quantity"
                    onClick={() => onQuantityChange(bookKey, quantity - 1)}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    className="btn-quantity"
                    onClick={() => onQuantityChange(bookKey, quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-mini ghost"
                  onClick={() => onRemoveFromCart(bookKey)}
                >
                  Quitar
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="panel-empty">El carrito esta vacio.</p>
        )}

        <div className="cart-summary">
          <span>Total</span>
          <strong>{formatBookPrice(cartTotal)}</strong>
        </div>

        <button
          type="button"
          className="btn-checkout"
          disabled={!session || cartBooks.length === 0}
          onClick={onCheckout}
        >
          Cerrar compra
        </button>

        {checkoutMessage && <p className="success-message">{checkoutMessage}</p>}
      </div>
    </section>
  );
}
