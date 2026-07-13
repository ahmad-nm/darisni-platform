import { SearchBar } from '../SearchBar/SearchBar';
import { SearchOverlay } from '../SearchOverlay/SearchOverlay';

export default function SearchSection({
  onSearch,
  isSearchActive,
  hasSearched,
  searchResults,
  onClose,
}) {
  return (
    <>
      <SearchBar
        onSearch={onSearch}
        isSearchActive={isSearchActive}
        hasSearched={hasSearched}
        searchResults={searchResults}
      />

      {searchResults.length > 0 && (
        <SearchOverlay
          searchResults={searchResults}
          onClose={onClose}
        />
      )}
    </>
  );
}