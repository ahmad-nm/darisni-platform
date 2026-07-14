import { CategoryCard } from './CategoryCard';
import style from './CategoryCardList.module.css';
import { useState, useEffect } from 'react';
import { fetchCategories } from '../../../../services/categoryService';

export function CategoryCardList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categories = await fetchCategories();
                setCategories(categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className={style.categoryCardListContainer}>
                <div className={style.loadingContainer}>
                    <p className={style.loadingText}>Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={style.categoryCardListContainer}>
            <div className={style.CategorySearchBar}>
                <input
                    type="text"
                    className={style.searchInput}
                    placeholder="Search for categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={style.categoryCards}>
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                        <CategoryCard key={category.id} Category={category} />
                    ))
                ) : (
                    <p>No categories found.</p>
                )}
            </div>
        </div>
    );
}