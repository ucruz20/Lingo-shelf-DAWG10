import BookEditorModal from '../components/BookEditorModal.jsx';
import BookList from '../components/BookList.jsx';
import BookToolbar from '../components/BookToolbar.jsx';
import { MOCK_BOOKS } from '../data/mockBooks.js';
import { useBookSearch } from '../hooks/useBookSearch.js';
import { useBooks } from '../hooks/useBooks.js';
import '../styles/books.css';

export default function BooksPage() {
  const {
    bookError,
    books,
    closeBookEditor,
    deleteSelectedBook,
    isEditorOpen,
    openCreateBook,
    openEditBook,
    saveBook,
    selectedBook,
  } = useBooks(MOCK_BOOKS);

  const {
    clearSearch,
    hasActiveSearch,
    searchValue,
    setSearchValue,
    submitSearch,
    visibleBooks,
  } = useBookSearch(books);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    submitSearch();
  };

  const handleDeleteBook = () => {
    deleteSelectedBook();
    clearSearch();
  };

  return (
    <main className="books-page">
      <header className="books-header">
        <h1 className="app-name">LingoShelf</h1>
      </header>

      <BookToolbar
        hasActiveSearch={hasActiveSearch}
        onClearSearch={clearSearch}
        onCreateBook={openCreateBook}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
        searchValue={searchValue}
      />

      <BookList books={visibleBooks} isFiltered={hasActiveSearch} onEdit={openEditBook} />

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
