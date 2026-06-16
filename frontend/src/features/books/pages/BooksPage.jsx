import { useMemo, useState } from 'react';
import AuthPanel from '../components/AuthPanel.jsx';
import BookEditorModal from '../components/BookEditorModal.jsx';
import BookList from '../components/BookList.jsx';
import BookToolbar from '../components/BookToolbar.jsx';
import CustomerShelf from '../components/CustomerShelf.jsx';
import {
  AUTH_USERS,
  createSessionUser,
  findAuthUser,
  userEmailExists,
} from '../data/authUsers.js';
import { useBookSearch } from '../hooks/useBookSearch.js';
import { useBooks } from '../hooks/useBooks.js';
import { usePersistentState } from '../hooks/usePersistentState.js';
import {
  getBookKey,
  getCartQuantity,
  getCartTotal,
  getPopularBooks,
} from '../utils/bookDisplay.js';
import '../styles/books.css';

const SESSION_KEY = 'lingo-shelf-session';
const WISHLIST_KEY = 'lingo-shelf-wishlist';
const CART_KEY = 'lingo-shelf-cart';
const STAFF_ROLES = ['admin', 'seller'];

export default function BooksPage() {
  const {
    bookError,
    books,
    catalogNotice,
    closeBookEditor,
    deleteSelectedBook,
    isEditorOpen,
    openCreateBook,
    openEditBook,
    saveBook,
    selectedBook,
  } = useBooks();
  const [session, setSession] = usePersistentState(SESSION_KEY, null);
  const [wishlistIds, setWishlistIds] = usePersistentState(WISHLIST_KEY, []);
  const [cartItems, setCartItems] = usePersistentState(CART_KEY, []);
  const [authError, setAuthError] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const {
    clearCatalogView,
    filterOptions,
    filters,
    hasActiveFilters,
    hasActiveSearch,
    searchValue,
    setSearchValue,
    submitSearch,
    updateFilter,
    visibleBooks,
  } = useBookSearch(books);

  const canManageInventory = STAFF_ROLES.includes(session?.role);
  const popularBooks = useMemo(() => getPopularBooks(books), [books]);
  const wishlistBooks = useMemo(
    () => books.filter((book) => wishlistIds.includes(getBookKey(book))),
    [books, wishlistIds],
  );
  const cartQuantity = getCartQuantity(cartItems);
  const cartTotal = getCartTotal(books, cartItems);
  const translationCount = books.reduce(
    (total, book) => total + (book.translations?.length ?? 0),
    0,
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    submitSearch();
  };

  const handleDeleteBook = () => {
    deleteSelectedBook();
    clearCatalogView();
  };

  const requireSession = () => {
    if (session) return true;

    setAuthError('Inicia sesion o registrate para personalizar tu compra.');
    return false;
  };

  const handleLogin = ({ email, password }) => {
    if (!email || !password) {
      setAuthError('Completa email y password.');
      return;
    }

    const authUser = findAuthUser(email, password);

    if (!authUser) {
      setAuthError('Credenciales invalidas. Usa un usuario registrado de LingoShelf.');
      return;
    }

    setSession(createSessionUser(authUser));
    setAuthError('');
  };

  const handleRegister = ({ email, name, password }) => {
    if (!email || !name || !password) {
      setAuthError('Completa todos los campos del registro.');
      return;
    }

    if (userEmailExists(email)) {
      setAuthError('Ese email ya pertenece a un usuario fijo. Inicia sesion con sus credenciales.');
      return;
    }

    setSession({
      email: email.trim().toLowerCase(),
      name,
      role: 'customer',
    });
    setAuthError('');
  };

  const handleLogout = () => {
    setSession(null);
    setAuthError('');
  };

  const handleToggleWishlist = (book) => {
    if (!requireSession()) return;

    const bookKey = getBookKey(book);
    setWishlistIds((currentIds) =>
      currentIds.includes(bookKey)
        ? currentIds.filter((currentId) => currentId !== bookKey)
        : [...currentIds, bookKey],
    );
    setCheckoutMessage('');
  };

  const handleRemoveWishlist = (book) => {
    const bookKey = getBookKey(book);
    setWishlistIds((currentIds) => currentIds.filter((currentId) => currentId !== bookKey));
  };

  const handleAddToCart = (book) => {
    if (!requireSession()) return;

    const bookKey = getBookKey(book);
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.bookKey === bookKey);

      if (existingItem) {
        return currentItems.map((item) =>
          item.bookKey === bookKey ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentItems, { bookKey, quantity: 1 }];
    });
    setCheckoutMessage('');
  };

  const handleQuantityChange = (bookKey, quantity) => {
    setCartItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.bookKey !== bookKey);
      }

      return currentItems.map((item) =>
        item.bookKey === bookKey ? { ...item, quantity } : item,
      );
    });
  };

  const handleRemoveFromCart = (bookKey) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.bookKey !== bookKey));
  };

  const handleCheckout = () => {
    if (!requireSession() || cartItems.length === 0) return;

    setCartItems([]);
    setCheckoutMessage('Compra registrada. Tu carrito quedo listo para una nueva orden.');
  };

  if (!session) {
    return (
      <main className="auth-page">
        <header className="books-header auth-brand">
          <h1 className="app-name">LingoShelf</h1>
          <p>Lecturas, traducciones y material de aprendizaje para idiomas.</p>
        </header>

        <div className="auth-gate">
          <section className="auth-welcome">
            <p className="section-kicker">Acceso</p>
            <h2>Bienvenido</h2>
            <p>Inicia sesion o crea una cuenta para entrar al catalogo.</p>

            <div className="demo-users" aria-label="Usuarios de prueba">
              {AUTH_USERS.map((user) => (
                <article key={user.email}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span>{user.password}</span>
                </article>
              ))}
            </div>
          </section>

          <AuthPanel
            authError={authError}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onRegister={handleRegister}
            session={session}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="books-page">
      <header className="app-topbar">
        <a href="#catalog" className="brand-link">
          LingoShelf
        </a>
        <nav className="topbar-metrics" aria-label="Resumen">
          <span>{books.length} libros</span>
          <span>{wishlistIds.length} guardados</span>
          <span>{cartQuantity} en carrito</span>
        </nav>
      </header>

      <section className="home-hero" aria-label="Inicio">
        <div className="hero-content">
          <p className="section-kicker">E-commerce para estudiantes de idiomas</p>
          <h1>LingoShelf</h1>
          <p>
            Lecturas originales, traducciones, material didactico y audiolibros en un
            catalogo pensado para aprender comprando mejor.
          </p>
        </div>

        <div className="hero-stats" aria-label="Indicadores del catalogo">
          <span>
            <strong>{books.length}</strong>
            Productos
          </span>
          <span>
            <strong>{translationCount}</strong>
            Traducciones
          </span>
          <span>
            <strong>{cartQuantity}</strong>
            Carrito
          </span>
        </div>
      </section>

      <div className="app-layout">
        <section className="main-content">
          {catalogNotice && <p className="catalog-notice">{catalogNotice}</p>}

          <section className="popular-section" aria-labelledby="popular-title">
            <div className="section-title-row">
              <div>
                <p className="section-kicker">Home dinamico</p>
                <h2 id="popular-title">Mas buscados</h2>
              </div>
              <span>{popularBooks.length}</span>
            </div>

            <BookList
              books={popularBooks}
              canManageInventory={canManageInventory}
              cartItems={cartItems}
              isFiltered={false}
              onAddToCart={handleAddToCart}
              onEdit={openEditBook}
              onToggleWishlist={handleToggleWishlist}
              variant="popular"
              wishlistIds={wishlistIds}
            />
          </section>

          <section id="catalog" className="catalog-section" aria-labelledby="catalog-title">
            <div className="section-title-row catalog-heading">
              <div>
                <p className="section-kicker">Catalogo</p>
                <h2 id="catalog-title">Libros y productos</h2>
              </div>
              {canManageInventory && (
                <div className="catalog-heading-actions">
                  <span>Gestion interna</span>
                  <button className="btn-create" onClick={openCreateBook}>
                    Anadir libro
                  </button>
                </div>
              )}
            </div>

            <BookToolbar
              filterOptions={filterOptions}
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              hasActiveSearch={hasActiveSearch}
              onClearCatalogView={clearCatalogView}
              onFilterChange={updateFilter}
              onSearchChange={setSearchValue}
              onSearchSubmit={handleSearchSubmit}
              resultCount={visibleBooks.length}
              searchValue={searchValue}
            />

            <BookList
              books={visibleBooks}
              canManageInventory={canManageInventory}
              cartItems={cartItems}
              isFiltered={hasActiveSearch || hasActiveFilters}
              onAddToCart={handleAddToCart}
              onEdit={openEditBook}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />
          </section>
        </section>

        <aside className="side-content" aria-label="Cuenta y compra">
          <AuthPanel
            authError={authError}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onRegister={handleRegister}
            session={session}
          />

          <CustomerShelf
            books={books}
            cartItems={cartItems}
            cartTotal={cartTotal}
            checkoutMessage={checkoutMessage}
            onAddToCart={handleAddToCart}
            onCheckout={handleCheckout}
            onQuantityChange={handleQuantityChange}
            onRemoveFromCart={handleRemoveFromCart}
            onRemoveWishlist={handleRemoveWishlist}
            session={session}
            wishlistBooks={wishlistBooks}
          />
        </aside>
      </div>

      {isEditorOpen && (
        <BookEditorModal
          book={selectedBook}
          errorMessage={bookError}
          onClose={closeBookEditor}
          onDelete={handleDeleteBook}
          onSave={saveBook}
        />
      )}
    </main>
  );
}
