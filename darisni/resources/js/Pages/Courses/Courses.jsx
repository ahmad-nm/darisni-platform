import { Loader } from '../../Components/Loader/Loader.jsx';
import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../Components/navBar/nav.jsx';
import { CourseInfoCard } from '../../Components/CourseInfo/CourseInfoCard.jsx';
import { CustomSelect } from '../../Components/CustomSelect/CustomSelect.jsx';
import { CartTab } from '../../Components/CartTab/CartTab.jsx';
import { About } from '../../Components/About/About.jsx';
import cartIcon from '../../assets/Icons/cart.png';
import style from './Courses.module.css';

export default function Courses({ CategoryId }) {
  const [isLoading, setIsLoading] = useState(true);
  const categoryId = CategoryId;
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [cartToggle , setCartToggle] = useState(false);
  const [dynamicSubjectOptions, setDynamicSubjectOptions] = useState([{ value: '', label: 'All Subjects' }]);
  const [dynamicSemesterOptions, setDynamicSemesterOptions] = useState([{ value: '', label: 'All Semesters' }]);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const SPECIAL_CATEGORIES = ['Pre Registered', 'Pre-Registered', 'preregistered'];

  useEffect(() => {
    const minLoadTime = 1500;
    const start = Date.now();

    // Fetch courses and categories data
    const fetchData = async () => {
      try {
        const [coursesResponse, categoriesResponse] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/categories')
        ]);
        
        const coursesData = await coursesResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        if (coursesData.success) {
          setAllCourses(coursesData.data);
        }
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty arrays
        setAllCourses([]);
        setCategories([]);
      }
    };

    const handleLoad = () => {
      const elapsed = Date.now() - start;
      const remaining = minLoadTime - elapsed;
      if (remaining > 0) {
        setTimeout(() => setIsLoading(false), remaining);
      } else {
        setIsLoading(false);
      }
    };

    // Fetch data first
    fetchData();

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  function isSpecialCategory(name) {
    if (!name) return false;
    return SPECIAL_CATEGORIES.some(
        special => name.trim().toLowerCase() === special.trim().toLowerCase()
    );
  }

  const specialCategory = isSpecialCategory(categoryName);

  function getUniqueSubjects(courses) {
    const subjects = courses
      .map(course => course.subject)
      .filter(Boolean); // remove null/undefined
    return Array.from(new Set(subjects));
  }

  function getUniqueSemesters(courses) {
    const semesters = courses
        .map(course => Number(course.semester))
        .filter(sem => sem && sem !== 0 && !isNaN(sem));
    return Array.from(new Set(semesters)).sort((a, b) => a - b);
  }

  // Memoize the applyFilters function to prevent unnecessary re-renders
  const applyFilters = useCallback((coursesToFilter, subject, semester) => {
    let filtered = coursesToFilter;

    console.log('Applying filters:', { subject, semester, totalCourses: coursesToFilter.length });

    if (subject) {
      filtered = filtered.filter(course => {
        const courseSubject = course.subject?.toLowerCase() || '';
        const filterSubject = subject.toLowerCase();
        
        console.log('Checking course:', course.title, 'Subject:', courseSubject, 'Filter:', filterSubject);
        
        // Check if the course subject contains the filter text or if filter contains course subject
        const matches = courseSubject.includes(filterSubject) || filterSubject.includes(courseSubject);
        console.log('Match result:', matches);
        
        return matches;
      });
    }

    if (semester) {
      filtered = filtered.filter(course => {
        const courseSemester = course.semester?.toString();
        return courseSemester === semester;
      });
    }

    console.log('Filtered courses:', filtered.length);
    setFilteredCourses(filtered);
  }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

  // Combined useEffect with all necessary dependencies
  useEffect(() => {
    const coursesForCategory = allCourses.filter(
      course => Number(course.category_id) === Number(categoryId)
    );

    // Subjects
    const uniqueSubjects = getUniqueSubjects(coursesForCategory);
    setDynamicSubjectOptions([
      { value: '', label: 'All Subjects' },
      ...uniqueSubjects.map(subject => ({
          value: subject,
          label: subject
      }))
    ]);

    // Semesters
    const uniqueSemesters = getUniqueSemesters(coursesForCategory);
    setDynamicSemesterOptions([
      { value: '', label: 'All Semesters' },
      ...uniqueSemesters.map(sem => ({
          value: String(sem),
          label: `Semester ${sem}`
      }))
    ]);

    applyFilters(coursesForCategory, subjectFilter, semesterFilter);

    const category = categories.find(cat => Number(cat.id) === Number(categoryId));
    setCategoryName(category ? category.name : 'Unknown Category');
  }, [categoryId, subjectFilter, semesterFilter, applyFilters, allCourses, categories]);    
  
  const handleFilter = (event) => {
        const { id, value } = event.target;

        if (id === 'subjectFilter') {
            setSubjectFilter(value);
        } else if (id === 'semesterFilter') {
            setSemesterFilter(value);
        }
    };

    const onRemoveFromCart = (courseId) => {
        setCartItems(cartItems.filter(item => item.id !== courseId));
    }

    const onAddToCart = (course) => {
        if (!cartItems.some(item => item.id === course.id)) {
            setCartItems([...cartItems, course]);
        }
    }

    return (
        <div className={style.coursesContainer}>
            {isLoading ? 
                <div className={style.loaderWrapper}>
                    <Loader />
                </div> 
                :
                <>
                    <Navbar />
                    <h1 className={style.pageTitle}>{categoryName} Courses</h1>

                    {!specialCategory && (
                      <>
                        <button className={`${style.cartToggleButton} ${cartToggle ? style.cartOpen : ''}`} onClick={() => setCartToggle(!cartToggle)}>
                            <span className={style.cartIcon}><img src={cartIcon} alt="Cart" /></span>
                        </button>
                        
                        {cartToggle && (
                            <div className={style.cartOverlay} onClick={() => setCartToggle(false)}></div>
                        )}
                        <CartTab 
                            cartItems={cartItems} 
                            onRemoveFromCart={onRemoveFromCart} 
                            cartToggle={cartToggle} 
                            setCartItems={setCartItems}
                        />
                      </>
                    )}

                    <div className={style.filterSection}>
                        <div className={style.filterSubject}>
                            {categoryId === "1" ? (
                                <>
                                    <label htmlFor="subjectFilter" className={style.filterLabel}>Subject:</label>
                                    <CustomSelect
                                        id="subjectFilter"
                                        value={subjectFilter}
                                        onChange={handleFilter}
                                        options={dynamicSubjectOptions}
                                        placeholder="All Subjects"
                                        onOpenChange={setSubjectDropdownOpen}
                                    />
                                </>
                            ) : (
                                <>
                                    <label htmlFor="subjectFilter" className={style.filterLabel}>Subject:</label>
                                    <CustomSelect
                                        id="subjectFilter"
                                        value={subjectFilter}
                                        onChange={handleFilter}
                                        options={dynamicSubjectOptions}
                                        placeholder="All Subjects"
                                        onOpenChange={setSubjectDropdownOpen}
                                    />
                                </>
                            )}
                        </div>

                        {dynamicSemesterOptions.length > 1 && (
                          <div className={`${style.filterSemester} ${subjectDropdownOpen ? style.semesterPushDown : ''}`}>
                            <label htmlFor="semesterFilter" className={style.filterLabel}>Semester:</label>
                            <CustomSelect
                              id="semesterFilter"
                              value={semesterFilter}
                              onChange={handleFilter}
                              options={dynamicSemesterOptions}
                              placeholder="All Semesters"
                            />
                          </div>
                        )}
                    </div>
                    
                    <div className={style.coursesGrid}>
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map(course => (
                                <CourseInfoCard key={course.id} course={course} onAddToCart={onAddToCart} specialCategory={specialCategory} />    
                            ))
                        ) : (
                            <p className={style.noCourses}>No courses found for this category.</p>
                        )}
                    </div>

                    <div className={style.aboutSection}>
                        <About />
                    </div>
                </>
            }
        </div>
    );
}