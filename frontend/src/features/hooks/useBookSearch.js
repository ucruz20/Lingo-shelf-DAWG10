import { useMemo, useState } from 'react';
import { bookMatchesSearch } from '../utils/bookSearch.js';

export function useBookSearch(books) {
  const [searchValue, setSearchValue] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const visibleBooks = useMemo(() => {
    if (!activeSearch) return books;

    return books.filter((book) => bookMatchesSearch(book, activeSearch));
  }, [activeSearch, books]);

  const submitSearch = () => {
    setActiveSearch(searchValue.trim().toLowerCase());
  };

  const clearSearch = () => {
    setSearchValue('');
    setActiveSearch('');
  };

  return {
    activeSearch,
    clearSearch,
    hasActiveSearch: Boolean(activeSearch),
    searchValue,
    setSearchValue,
    submitSearch,
    visibleBooks,
  };
}
