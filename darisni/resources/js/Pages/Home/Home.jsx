import { Loader } from '../../Components/Loader/Loader.jsx';
import { WhatWeOffer } from './components/WhatWeOffer/WhatWeOffer.jsx';
import { CourseCardList } from './components/CourseCard/CourseCardList.jsx';
// import { PlansList } from '../../Components/Plans/PlansList.jsx';
// import { TestimonialsList } from '../../Components/Testimonials/TestimonialsList.jsx';
import HomeHeader from './components/Home/HomeHeader.jsx';
import CourseSuggestionSection from './components/Home/CourseSuggestionsSection.jsx';
import { About } from '../AboutPage/components/About/About.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import style from './Home.module.css';

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const { user, setUser } = useAuth();

  useEffect(() => {
    const minLoadTime = 2000; // 2 seconds
    const start = Date.now();

    // Fetch courses data
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        if (data.success) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to empty array if API fails
        setCourses([]);
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

    // Fetch courses first
    fetchCourses();

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const handleSearch = (query) => {
    const results = courses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.code.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setIsSearchActive(results.length > 0);
    setHasSearched(true);
  }

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchResults([]);
    setHasSearched(false);
  }

  useEffect(() => {
    if (isSearchActive) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isSearchActive, isLoading]);

  return (
    <div className={style.HomeContainer}>
      {isLoading ? 
        <div className={style.loaderWrapper}>
          <Loader />
        </div>
      :
      <>
        <HomeHeader
        onSearch={handleSearch}
        isSearchActive={isSearchActive}
        hasSearched={hasSearched}
        searchResults={searchResults}
        onClose={handleCloseSearch}
      />
        <div className={style.WWOContainer}>
          <WhatWeOffer />
        </div>
        <div className={style.CourseCardContainer}>
          <CourseCardList />
        </div>
        {/* <div className={style.PlansContainer}>
          <PlansList />
        </div> */}
        {/* <div className={style.TestimonialsListContainer}>
          <TestimonialsList />
        </div> */}
        <CourseSuggestionSection />
        <div className={style.AboutContainer}>
          <About />
        </div>
      </>
      }
    </div>
  );
}

export default Home;