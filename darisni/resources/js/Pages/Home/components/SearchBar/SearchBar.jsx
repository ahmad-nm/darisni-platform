import { useState, useEffect } from 'react';
import style from './SearchBar.module.css';

export function SearchBar({ onSearch, isSearchActive, hasSearched, searchResults }) {
    const [search, setSearch] = useState('');

    const handleSearch = () => {
        if (search.trim()) {
            onSearch(search);
        }
        
        if (searchResults.length > 0) {
            setSearch('');
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);
    };

    useEffect(() => {
        const noResultsElement = document.getElementById('no-results');
        const container = document.getElementById('container');
        
        // Show "no results" only if:
        // 1. A search was performed (hasSearched = true)
        // 2. No search is currently active (isSearchActive = false)
        // 3. No results were found (searchResults.length === 0)
        const showNoResults = hasSearched && !isSearchActive && searchResults.length === 0;
        
        if (showNoResults) {
            if (noResultsElement && container) {
                noResultsElement.style.display = 'flex';
                container.style.height = '130px';
                container.style.bottom = '-95px';
            }
        } else {
            if (noResultsElement && container) {
                noResultsElement.style.display = 'none';
                container.style.height = '110px';
                container.style.bottom = '-85px';
            }
        }
    }, [hasSearched, isSearchActive, searchResults]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div id='container' className={style.Container}>
            <h2>Find Your Course, Apply Now!!</h2>
            
            <p className={style.Description}>Search for courses by title or code.</p>
            
            <div className={style.SearchBar}>
                <input 
                    type="text" 
                    placeholder="Search for courses..." 
                    className={style.SearchInput} 
                    value={search} 
                    onChange={handleInputChange} 
                    onKeyPress={handleKeyPress}
                />
                <button className={style.SearchButton} onClick={handleSearch}>Search</button>
            </div>

            <p id='no-results' className={style.NoResults}>No results found.</p>
        </div>
    )
}