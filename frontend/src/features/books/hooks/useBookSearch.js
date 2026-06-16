import { useMemo, useState } from 'react';
import {
  bookMatchesFilters,
  bookMatchesSearch,
  getBookFilterOptions,
} from '../utils/bookSearch.js';

const EMPTY_FILTERS = {
  category: '',
  language: '',
  level: '',
};

export function useBookSearch(books) {
  const [searchValue, setSearchValue] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const filterOptions = useMemo(() => getBookFilterOptions(books), [books]);

  const visibleBooks = useMemo(
    () =>
      books.filter(
        (book) => bookMatchesSearch(book, activeSearch) && bookMatchesFilters(book, filters),
      ),
    [activeSearch, books, filters],
  );

  const submitSearch = () => {
    setActiveSearch(searchValue.trim().toLowerCase());
  };

  const updateFilter = (filterName, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: value,
    }));
  };

  const clearSearch = () => {
    setSearchValue('');
    setActiveSearch('');
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  const clearCatalogView = () => {
    clearSearch();
    clearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return {
    activeSearch,
    clearCatalogView,
    clearFilters,
    clearSearch,
    filterOptions,
    filters,
    hasActiveFilters,
    hasActiveSearch: Boolean(activeSearch),
    searchValue,
    setSearchValue,
    submitSearch,
    updateFilter,
    visibleBooks,
  };
}
