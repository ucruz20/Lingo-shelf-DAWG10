export default function BookToolbar({
  hasActiveSearch,
  onClearSearch,
  onCreateBook,
  onSearchChange,
  onSearchSubmit,
  searchValue,
}) {
  return (
    <section className="books-toolbar" aria-label="Acciones de libros">
      <form onSubmit={onSearchSubmit} className="search-form">
        <input
          type="search"
          placeholder="Buscar libro"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="search-input"
        />

        <button className="btn-search" type="submit">
          Buscar
        </button>

        {hasActiveSearch && (
          <button className="btn-clear" type="button" onClick={onClearSearch}>
            Limpiar
          </button>
        )}
      </form>

      <button className="btn-create" onClick={onCreateBook}>
        Anadir nuevo libro
      </button>
    </section>
  );
}
