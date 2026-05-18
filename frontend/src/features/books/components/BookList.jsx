import { formatBookPrice, getBookDisplayTitle } from '../utils/bookDisplay.js';

export default function BookList({ books, isFiltered, onEdit }) {
  if (books.length === 0) {
    return (
      <p className="books-empty">
        {isFiltered ? 'No se encontraron libros.' : 'Todavia no hay libros registrados.'}
      </p>
    );
  }

  return (
    <section className="books-list" aria-label="Libros">
      {books.map((book) => (
        <article key={book.isbn} className="book-item">
          <div className="book-info">
            <p className="book-title">
              <strong>{getBookDisplayTitle(book)}</strong>
            </p>
            <p className="book-price">{formatBookPrice(book.price)}</p>
          </div>

          <button className="btn-edit" onClick={() => onEdit(book)}>
            Editar
          </button>
        </article>
      ))}
    </section>
  );
}
