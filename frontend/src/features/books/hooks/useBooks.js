import { useState } from 'react';

const DUPLICATED_ISBN_MESSAGE = 'Ya existe un libro con ese ISBN en la lista.';

export function useBooks(initialBooks) {
  const [books, setBooks] = useState(initialBooks);
  const [bookError, setBookError] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

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

  const saveBook = (bookData) => {
    const isDuplicatedIsbn = books.some(
      (book) => book.isbn === bookData.isbn && book.isbn !== selectedBook?.isbn,
    );

    if (isDuplicatedIsbn) {
      setBookError(DUPLICATED_ISBN_MESSAGE);
      return false;
    }

    if (selectedBook) {
      setBooks((currentBooks) =>
        currentBooks.map((book) => (book.isbn === selectedBook.isbn ? bookData : book)),
      );
    } else {
      setBooks((currentBooks) => [...currentBooks, bookData]);
    }

    closeBookEditor();
    return true;
  };

  const deleteSelectedBook = () => {
    if (!selectedBook) return;

    setBooks((currentBooks) => currentBooks.filter((book) => book.isbn !== selectedBook.isbn));
    closeBookEditor();
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
