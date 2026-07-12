import { CourseCard } from '../CourseCard/CourseCard';
import style from './SearchOverlay.module.css';

export function SearchOverlay({ searchResults, onClose }) {
    return (
        <>
            <div className={style.OverlayBackdrop} onClick={onClose} />
        
            <div className={style.Overlay}>
                <div className={style.CloseButton} onClick={onClose}>X</div>
                <h2>Search Results</h2>
                <div className={style.Results}>
                    {searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                            <div key={index} className={style.ResultItem}>
                                <CourseCard course={result} />
                            </div>
                        ))
                    ) : (
                        <p className={style.NoResults}>No results found</p>
                    )}
                </div>
            </div>
        </>
    );
}