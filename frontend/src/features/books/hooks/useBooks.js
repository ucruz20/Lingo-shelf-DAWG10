import { useCallback, useEffect, useState } from 'react';
import { MOCK_BOOKS } from '../data/mockBooks.js';

const API_URL = 'http://localhost:8080/books';
const DUPLICATED_ISBN_MESSAGE = 'Ya existe un libro con ese ISBN en la lista.';
const LOCAL_BOOKS_KEY = 'lingo-shelf-books';

function createLocalId(books) {
  const highestId = books.reduce((maxId, book) => Math.max(maxId, Number(book.id) || 0), 0);
  return highestId + 1;
}

function normalizeBooks(books) {
  return books.map((book, index) => ({
    ...book,
    id: book.id ?? index + 1,
    translations: Array.isArray(book.translations) ? book.translations : [],
  }));
}

function readLocalBooks() {
  try {
    const storedBooks = localStorage.getItem(LOCAL_BOOKS_KEY);
    return storedBooks ? normalizeBooks(JSON.parse(storedBooks)) : null;
  } catch {
    return null;
  }
}

function persistLocalBooks(books) {
  try {
    localStorage.setItem(LOCAL_BOOKS_KEY, JSON.stringify(books));
  } catch {
    // The app can continue with in-memory state if persistence is blocked.
  }
}

function getInitialBooks() {
  return readLocalBooks() ?? normalizeBooks(MOCK_BOOKS);
}

function sameBook(firstBook, secondBook) {
  return String(firstBook.id ?? firstBook.isbn) === String(secondBook.id ?? secondBook.isbn);
}

export function useBooks() {
  const [books, setBooks] = useState(getInitialBooks);
  const [bookError, setBookError] = useState('');
  const [catalogNotice, setCatalogNotice] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isUsingLocalCatalog, setIsUsingLocalCatalog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener los libros');

      const data = await response.json();
      const normalizedBooks = normalizeBooks(data);

      setBooks(normalizedBooks);
      setBookError('');
      setCatalogNotice('');
      setIsUsingLocalCatalog(false);
    } catch {
      const localBooks = getInitialBooks();

      setBooks(localBooks);
      setCatalogNotice('Modo local activo: el backend de libros no esta disponible.');
      setIsUsingLocalCatalog(true);
    }
  }, []);

  useEffect(() => {
    // The initial catalog load synchronizes the UI with the books API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBooks();
  }, [fetchBooks]);

  const closeBookEditor = () => {
    setBookError('');
    setIsEditorOpen(false);
  };

  const openCreateBook = () => {
    setBookError('');
    setSelectedBook(null);
    setIsEditorOpen(true);
  };

  const openEditBook = (book) => {
    setBookError('');
    setSelectedBook(book);
    setIsEditorOpen(true);
  };

  const saveBookLocally = (bookData, noticeMessage) => {
    const isEdit = Boolean(selectedBook);
    const nextBook = {
      ...bookData,
      id: selectedBook?.id ?? createLocalId(books),
      popularity: selectedBook?.popularity ?? 60,
    };
    const nextBooks = isEdit
      ? books.map((book) => (sameBook(book, selectedBook) ? nextBook : book))
      : [nextBook, ...books];

    setBooks(nextBooks);
    persistLocalBooks(nextBooks);
    setCatalogNotice(noticeMessage);
    setIsUsingLocalCatalog(true);
    closeBookEditor();
  };

  const saveBook = async (bookData) => {
    const isDuplicatedIsbn = books.some(
      (book) => book.isbn === bookData.isbn && book.isbn !== selectedBook?.isbn,
    );

    if (isDuplicatedIsbn) {
      setBookError(DUPLICATED_ISBN_MESSAGE);
      return false;
    }

    if (isUsingLocalCatalog) {
      saveBookLocally(bookData, 'Libro guardado en el catalogo local.');
      return true;
    }

    try {
      const isEdit = Boolean(selectedBook);
      const url = isEdit ? `${API_URL}/${selectedBook.id}` : `${API_URL}/create`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        body: JSON.stringify(bookData),
        headers: { 'Content-Type': 'application/json' },
        method,
      });

      if (!response.ok) throw new Error('No se pudo guardar el libro en el servidor.');

      await fetchBooks();
      closeBookEditor();
      return true;
    } catch (error) {
      saveBookLocally(bookData, `${error.message} Cambios guardados localmente.`);
      return true;
    }
  };

  const deleteSelectedBook = async () => {
    if (!selectedBook) return;

    const deleteBookLocally = (noticeMessage) => {
      const nextBooks = books.filter((book) => !sameBook(book, selectedBook));
      setBooks(nextBooks);
      persistLocalBooks(nextBooks);
      setCatalogNotice(noticeMessage);
      setIsUsingLocalCatalog(true);
      closeBookEditor();
    };

    if (isUsingLocalCatalog || !selectedBook.id) {
      deleteBookLocally('Libro eliminado del catalogo local.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${selectedBook.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('No se pudo eliminar el libro.');

      await fetchBooks();
      closeBookEditor();
    } catch (error) {
      deleteBookLocally(`${error.message} Cambio aplicado localmente.`);
    }
  };

  return {
    bookError,
    books,
    catalogNotice,
    closeBookEditor,
    deleteSelectedBook,
    isEditorOpen,
    isUsingLocalCatalog,
    openCreateBook,
    openEditBook,
    saveBook,
    selectedBook,
  };
}
