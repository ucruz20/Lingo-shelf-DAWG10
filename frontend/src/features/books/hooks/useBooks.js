import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/books'
const DUPLICATED_ISBN_MESSAGE = 'Ya existe un libro con ese ISBN en la lista.';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [bookError, setBookError] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener los libros');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setBookError(error.message);
    }
  };

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

  const saveBook = async (bookData) => {
    const isDuplicatedIsbn = books.some(
      (book) => book.isbn === bookData.isbn && book.isbn !== selectedBook?.isbn,
    );

    if (isDuplicatedIsbn) {
      setBookError(DUPLICATED_ISBN_MESSAGE);
      return false;
    }

    try {
      const isEdit = !!selectedBook;
      const url = isEdit ? `${API_URL}/${selectedBook.id || selectedBook.isbn}` : `${API_URL}/create`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error('No se pudo guardar el libro en el servidor.');

      await fetchBooks();
      closeBookEditor();
      return true;
    } catch (error) {
      setBookError(error.message);
        return false;
    }
  };

  const deleteSelectedBook = async () => {
    if (!selectedBook) return;

    try {
      const targetId = selectedBook.id || selectedBook.isbn;
      const response = await fetch(`${API_URL}/${targetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('No se pudo eliminar el libro.');

      await fetchBooks();
      closeBookEditor();
    } catch (error) {
      setBookError(error.message);
    }
  };

  return {
    bookError,
    books,
    closeBookEditor,
    deleteSelectedBook,
    isEditorOpen,
    openCreateBook,
    openEditBook,
    saveBook,
    selectedBook,
  };
}
