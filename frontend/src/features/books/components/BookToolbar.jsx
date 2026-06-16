export default function BookToolbar({
  filterOptions,
  filters,
  hasActiveFilters,
  hasActiveSearch,
  onClearCatalogView,
  onFilterChange,
  onSearchChange,
  onSearchSubmit,
  resultCount,
  searchValue,
}) {
  const hasActiveCatalogView = hasActiveSearch || hasActiveFilters;

  return (
    <section className="books-toolbar catalog-toolbar" aria-label="Acciones de catalogo">
      <form onSubmit={onSearchSubmit} className="search-form catalog-search-row">
        <label className="search-field" htmlFor="book-search">
          <span>Buscar</span>
          <input
            id="book-search"
            type="search"
            placeholder="Titulo, autor, idioma o ISBN"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="search-input"
          />
        </label>

        <div className="search-actions">
          <button className="btn-search" type="submit">
            Buscar
          </button>

          {hasActiveCatalogView && (
            <button className="btn-clear" type="button" onClick={onClearCatalogView}>
              Limpiar
            </button>
          )}
        </div>
      </form>

      <div className="catalog-filter-panel">
        <div className="filter-heading">
          <span>Filtros</span>
          <strong>{resultCount} productos</strong>
        </div>

        <div className="catalog-filters" aria-label="Filtros del catalogo">
          <label>
            Categoria
            <select
              value={filters.category}
              onChange={(event) => onFilterChange('category', event.target.value)}
            >
              <option value="">Todas</option>
              {filterOptions.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            Idioma
            <select
              value={filters.language}
              onChange={(event) => onFilterChange('language', event.target.value)}
            >
              <option value="">Todos</option>
              {filterOptions.languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nivel
            <select
              value={filters.level}
              onChange={(event) => onFilterChange('level', event.target.value)}
            >
              <option value="">Todos</option>
              {filterOptions.levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
