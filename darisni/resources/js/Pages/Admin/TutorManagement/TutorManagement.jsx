import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import styles from './TutorManagement.module.css';

export default function TutorManagement({ tutors: initialTutors, users: initialUsers, courses: initialCourses, stats: initialStats }) {
    const [tutors, setTutors] = useState((initialTutors || []).filter(Boolean));
    const [filteredTutors, setFilteredTutors] = useState((initialTutors || []).filter(Boolean));
    const [users, setUsers] = useState(initialUsers || []);
    const [courses, setCourses] = useState(initialCourses || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTutorModal, setShowTutorModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
    const [stats, setStats] = useState(initialStats || {});
    const tutorsPerPage = 12;

    // Update data when props change
    useEffect(() => {
        if (initialTutors && initialTutors.length >= 0) {
            setTutors(initialTutors);
            setFilteredTutors(initialTutors);
        }
        if (initialUsers) setUsers(initialUsers);
        if (initialCourses) setCourses(initialCourses);
        if (initialStats) setStats(initialStats);
    }, [initialTutors, initialUsers, initialCourses, initialStats]);

    // Filter tutors based on search and status
    useEffect(() => {
        let filtered = tutors.filter(Boolean); // Remove any null/undefined values

        if (searchQuery) {
            filtered = filtered.filter(tutor => 
                tutor && (
                    tutor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tutor.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tutor.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tutor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        if (filterStatus !== 'all') {
            switch (filterStatus) {
                case 'active':
                    filtered = filtered.filter(tutor => tutor && tutor.courses && tutor.courses.length > 0);
                    break;
                case 'inactive':
                    filtered = filtered.filter(tutor => tutor && (!tutor.courses || tutor.courses.length === 0));
                    break;
                case 'experienced':
                    filtered = filtered.filter(tutor => tutor && tutor.experience_years >= 2);
                    break;
                case 'new':
                    filtered = filtered.filter(tutor => tutor && tutor.experience_years < 2);
                    break;
                default:
                    break;
            }
        }

        setFilteredTutors(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchQuery, filterStatus, tutors]);

    // Pagination
    const indexOfLastTutor = currentPage * tutorsPerPage;
    const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
    const currentTutors = filteredTutors.slice(indexOfFirstTutor, indexOfLastTutor);
    const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleDeleteTutor = async (tutorId) => {
        setSelectedTutor(tutors.find(tutor => tutor.id === tutorId));
        setShowDeleteModal(true);
    };

    const confirmDeleteTutor = async () => {
        if (!selectedTutor) return;

        try {
            // Prevent changing your own admin role (already handled)
            if (
                window.Laravel &&
                window.Laravel.user &&
                window.Laravel.user.id === selectedTutor.user.id &&
                window.Laravel.user.role === 'admin'
            ) {
                alert('You cannot change your own role from admin.');
                return;
            }

            // Delete tutor record
            await deleteTutor(selectedTutor.id);

            // Remove tutor from local state
            const updatedTutors = tutors.filter(tutor => tutor.id !== selectedTutor.id);
            setTutors(updatedTutors);

            // Apply current filters to updated tutors
            applyFilters(updatedTutors);

            setShowDeleteModal(false);
            setSelectedTutor(null);
        } catch (error) {
            console.error('Error deleting tutor:', error);
            alert('Failed to delete tutor. Please try again.');
        }
    };

    const applyFilters = (tutorsList) => {
        let filtered = tutorsList;

        if (searchQuery) {
            filtered = filtered.filter(tutor => 
                tutor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            switch (filterStatus) {
                case 'active':
                    filtered = filtered.filter(tutor => tutor.courses && tutor.courses.length > 0);
                    break;
                case 'inactive':
                    filtered = filtered.filter(tutor => !tutor.courses || tutor.courses.length === 0);
                    break;
                case 'experienced':
                    filtered = filtered.filter(tutor => tutor.experience_years >= 2);
                    break;
                case 'new':
                    filtered = filtered.filter(tutor => tutor.experience_years < 2);
                    break;
                default:
                    break;
            }
        }

        setFilteredTutors(filtered);
    };

    const handleViewTutor = (tutor) => {
        setSelectedTutor(tutor);
        setModalMode('view');
        setShowTutorModal(true);
    };

    const handleEditTutor = (tutor) => {
        setSelectedTutor(tutor);
        setModalMode('edit');
        setShowTutorModal(true);
    };

    const handleCreateTutor = () => {
        setSelectedTutor(null);
        setModalMode('create');
        setShowTutorModal(true);
    };

    const handleSaveTutor = async (tutorData) => {
        try {
            let savedTutor;
            const { availability, courses, ...basicTutorData } = tutorData;
            
            if (modalMode === 'create') {
                // Create the tutor first
                savedTutor = await createTutor(basicTutorData);
                
                // Save availability if provided
                if (availability && availability.length > 0) {
                    for (const slot of availability) {
                        if (slot.day && slot.start_time && slot.end_time) {
                            try {
                                await createTutorAvailability({
                                    tutor_id: savedTutor.id,
                                    day: slot.day,
                                    start_time: slot.start_time,
                                    end_time: slot.end_time
                                });
                            } catch (error) {
                                console.error('Error saving availability slot:', error);
                            }
                        }
                    }
                }
                
                // Save courses if provided
                if (courses && courses.length > 0) {
                    console.log('Saving courses:', courses);
                    for (const courseId of courses) {
                        try {
                            console.log('Creating tutor course:', {
                                tutor_id: savedTutor.id,
                                course_id: courseId
                            });
                            const result = await createTutorCourse({
                                tutor_id: savedTutor.id,
                                course_id: courseId
                            });
                            console.log('Course assignment result:', result);
                        } catch (error) {
                            console.error('Error saving course assignment:', error);
                            console.error('Error response:', error.response?.data);
                            console.error('Error status:', error.response?.status);
                            
                            // Handle specific error cases
                            if (error.response?.status === 409) {
                                console.log('Course already assigned to tutor');
                            } else if (error.response?.status === 422) {
                                console.error('Validation error:', error.response?.data?.errors);
                            } else if (error.response?.status === 404) {
                                console.error('Tutor or course not found');
                            } else {
                                console.error('Unexpected error:', error.message);
                            }
                        }
                    }
                }
                
                // Refresh the page to show updated data
                window.location.reload();
            } else {
                // Update existing tutor with availability
                const updateData = {
                    ...basicTutorData,
                    availability: availability || []
                };
                
                savedTutor = await updateTutor(selectedTutor.id, updateData);
                
                // Handle courses separately for updates if needed
                // Note: For now, we'll just handle availability with the update
                
                // Refresh the page to show updated data
                window.location.reload();
            }
            
            setShowTutorModal(false);
            setSelectedTutor(null);
        } catch (error) {
            console.error('Error saving tutor:', error);
            throw error;
        }
    };

    // Course management functions
    const createTutor = async (data) => {
        try {
            const response = await fetch('/admin/tutors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.tutor;
        } catch (error) {
            console.error('Error creating tutor:', error);
            throw error;
        }
    };

    const updateTutor = async (id, data) => {
        try {
            const response = await fetch(`/admin/tutors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.tutor;
        } catch (error) {
            console.error('Error updating tutor:', error);
            throw error;
        }
    };

    const deleteTutor = async (id) => {
        return new Promise((resolve, reject) => {
            router.delete(`/admin/tutors/${id}`, {
                onSuccess: () => {
                    resolve();
                },
                onError: (errors) => {
                    console.error('Delete errors:', errors);
                    reject(new Error('Delete failed'));
                }
            });
        });
    };

    const updateUserRole = async (userId, role) => {
        return new Promise((resolve, reject) => {
            // Find the user to get their current name and email
            const userToUpdate = selectedTutor?.user;
            if (!userToUpdate) {
                reject(new Error('User not found'));
                return;
            }

            router.put(`/admin/users/${userId}`, { 
                name: userToUpdate.name,
                email: userToUpdate.email,
                role: role,
                email_verified_at: userToUpdate.email_verified_at ? true : false
            }, {
                onSuccess: () => {
                    resolve();
                },
                onError: (errors) => {
                    console.error('Role update errors:', errors);
                    reject(new Error('Role update failed'));
                }
            });
        });
    };

    const createTutorAvailability = async (data) => {
        try {
            const response = await fetch('/admin/tutors/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating tutor availability:', error);
            throw error;
        }
    };

    const createTutorCourse = async (data) => {
        try {
            const response = await fetch('/admin/tutors/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating tutor course:', error);
            throw error;
        }
    };

    const updateTutorCourse = async (courseId, tutorId, data) => {
        try {
            const response = await fetch(`/admin/tutors/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ ...data, tutor_id: tutorId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating tutor course:', error);
            throw error;
        }
    };

    const deleteTutorCourse = async (courseId, tutorId) => {
        try {
            const response = await fetch(`/admin/tutors/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ tutor_id: tutorId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting tutor course:', error);
            throw error;
        }
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return (total / ratings.length).toFixed(1);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.pageContainer}>
                    <Head title="Tutor Management" />
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading tutors...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <Head title="Tutor Management" />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div>
                                <h1 className={styles.title}>Tutor Management</h1>
                                <p className={styles.subtitle}>Manage tutors and their profiles</p>
                            </div>
                            <div className={styles.headerButtons}>
                                <button 
                                    className={styles.applicationsButton}
                                    onClick={() => router.visit('/admin/applications')}
                                >
                                    📋 Tutor Applications
                                </button>
                                <button 
                                    className={styles.addTutorButton}
                                    onClick={handleCreateTutor}
                                >
                                    + Add New Tutor
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filtersContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search tutors by name, university, or bio..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className={styles.searchInput}
                            />
                            <div className={styles.searchIcon}>🔍</div>
                        </div>
                        
                        <select 
                            value={filterStatus} 
                            onChange={handleFilterChange}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Tutors</option>
                            <option value="active">Active (With Courses)</option>
                            <option value="inactive">Inactive (No Courses)</option>
                            <option value="experienced">Experienced (2+ years)</option>
                            <option value="new">New (&lt; 2 years)</option>
                        </select>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{filteredTutors.length}</span>
                            <span className={styles.statLabel}>Total Tutors</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {(filteredTutors || []).filter(tutor => tutor && tutor.courses && tutor.courses.length > 0).length}
                            </span>
                            <span className={styles.statLabel}>Active Tutors</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {(filteredTutors || []).reduce((total, tutor) => total + (tutor && tutor.courses ? tutor.courses.length : 0), 0)}
                            </span>
                            <span className={styles.statLabel}>Total Courses</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {filteredTutors.length > 0 ? 
                                    ((filteredTutors || []).reduce((total, tutor) => 
                                        total + parseFloat(calculateAverageRating(tutor && tutor.ratings ? tutor.ratings : []) || 0), 0) / filteredTutors.length).toFixed(1) 
                                    : '0.0'}
                            </span>
                            <span className={styles.statLabel}>Avg Rating</span>
                        </div>
                    </div>

                    {/* Tutors Grid */}
                    <div className={styles.tutorsGrid}>
                        {(currentTutors || []).filter(Boolean).map(tutor => (
                            <div key={tutor.id} className={styles.tutorCard}>
                                <div className={styles.tutorHeader}>
                                    <div className={styles.tutorId}>#{tutor.id}</div>
                                    <div className={styles.tutorActions}>
                                        <button 
                                            className={styles.actionBtn}
                                            onClick={() => handleViewTutor(tutor)}
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button 
                                            className={styles.actionBtn}
                                            onClick={() => handleEditTutor(tutor)}
                                            title="Edit Tutor"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className={styles.actionBtn}
                                            onClick={() => handleDeleteTutor(tutor.id)}
                                            title="Delete Tutor"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                
                                <div className={styles.tutorImage}>
                                    {tutor.image || tutor.user?.avatar ? (
                                        <img src={tutor.image || tutor.user?.avatar} alt={tutor.name || tutor.user?.name} />
                                    ) : (
                                        <div className={styles.placeholderImage}>👨‍🏫</div>
                                    )}
                                </div>
                                
                                <div className={styles.tutorContent}>
                                    <h3 className={styles.tutorName}>
                                        {tutor.name || tutor.user?.name || 'Unknown Tutor'}
                                    </h3>
                                    <p className={styles.tutorUniversity}>
                                        {tutor.university || 'No university specified'}
                                    </p>
                                    <p className={styles.tutorBio}>
                                        {tutor.bio || 'No bio provided'}
                                    </p>
                                    
                                    <div className={styles.tutorStats}>
                                        <div className={styles.statRow}>
                                            <span className={styles.tutorExperience}>
                                                📚 {tutor.experience_years || 0} years experience
                                            </span>
                                            <span className={styles.tutorRating}>
                                                ⭐ {calculateAverageRating(tutor.ratings || [])}
                                            </span>
                                        </div>
                                        <div className={styles.statRow}>
                                            <span className={styles.tutorCourses}>
                                                🎓 {tutor.courses ? tutor.courses.length : 0} courses
                                            </span>
                                            <span className={styles.tutorRate}>
                                                💰 ${tutor.hourly_rate || 0}/hr
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.tutorFooter}>
                                        <span className={styles.tutorStatus}>
                                            {tutor.courses && tutor.courses.length > 0 ? 
                                                <span className={styles.activeStatus}>🟢 Active</span> : 
                                                <span className={styles.inactiveStatus}>🔴 Inactive</span>
                                            }
                                        </span>
                                        <span className={styles.tutorDate}>
                                            Joined: {new Date(tutor.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button 
                                className={styles.pageBtn}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            
                            <div className={styles.pageNumbers}>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`${styles.pageNumber} ${currentPage === index + 1 ? styles.active : ''}`}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                className={styles.pageBtn}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {filteredTutors.length === 0 && (
                        <div className={styles.noResults}>
                            <p>No tutors found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Tutor Details/Edit Modal */}
                {showTutorModal && (
                    <TutorModal
                        tutor={selectedTutor}
                        mode={modalMode}
                        users={users}
                        courses={courses}
                        onClose={() => {
                            setShowTutorModal(false);
                            setSelectedTutor(null);
                            setModalMode('view');
                        }}
                        onSave={handleSaveTutor}
                        setModalMode={setModalMode}
                        createTutorCourse={createTutorCourse}
                        deleteTutorCourse={deleteTutorCourse}
                        updateTutorCourse={updateTutorCourse}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedTutor && (
                    <DeleteConfirmationModal
                        tutor={selectedTutor}
                        onConfirm={confirmDeleteTutor}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setSelectedTutor(null);
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

// Tutor Details/Edit Modal Component
function TutorModal({ tutor, mode, users, courses, onClose, onSave, setModalMode, createTutorCourse, deleteTutorCourse, updateTutorCourse }) {
    const [formData, setFormData] = useState({
        user_id: tutor?.user_id || '',
        name: tutor?.name || '',
        university: tutor?.university || '',
        year: tutor?.year || '',
        bio: tutor?.bio || '',
        contact: tutor?.contact || '',
        experience_years: tutor?.experience_years || 0,
        hourly_rate: tutor?.hourly_rate || '',
        image: tutor?.image || ''
    });
    const [availability, setAvailability] = useState(tutor?.availability || []);
    const [tutorCourses, setTutorCourses] = useState(tutor?.courses || []);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const availableUsers = users || [];

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const response = await fetch('/admin/tutors/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formDataUpload
            });
            const data = await response.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                alert('Failed to upload image.');
            }
        } catch (error) {
            alert('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleCourseAdd = async (e) => {
        const courseId = e.target.value;
        if (courseId) {
            const course = courses.find(c => c.id === parseInt(courseId));
            if (course && !tutorCourses.some(tc => tc.id === course.id)) {
                // If we're editing an existing tutor, make API call immediately
                if (mode === 'edit' && tutor) {
                    try {
                        await createTutorCourse({
                            tutor_id: tutor.id,
                            course_id: course.id
                        });
                        console.log(`Course ${course.title} assigned to tutor successfully`);
                    } catch (error) {
                        console.error('Error assigning course:', error);
                        alert(`Failed to assign course: ${error.response?.data?.message || error.message}`);
                        return; // Don't update local state if API call failed
                    }
                }
                
                setTutorCourses([...tutorCourses, course]);
            }
        }
    };

    const handleCourseRemove = async (index) => {
        const courseToRemove = tutorCourses[index];
        
        // If we're editing an existing tutor, make API call immediately
        if (mode === 'edit' && tutor && courseToRemove) {
            try {
                await deleteTutorCourse(courseToRemove.id, tutor.id);
                console.log(`Course ${courseToRemove.title} unassigned from tutor successfully`);
            } catch (error) {
                console.error('Error unassigning course:', error);
                alert(`Failed to unassign course: ${error.response?.data?.message || error.message}`);
                return; // Don't update local state if API call failed
            }
        }
        
        setTutorCourses(tutorCourses.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'view') return;
        
        setLoading(true);
        try {
            // Include availability and courses data with the form data
            const completeData = {
                ...formData,
                availability: availability,
                courses: tutorCourses.map(course => course.id)
            };
            await onSave(completeData);
        } catch (error) {
            alert('Failed to save tutor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAvailabilityAdd = () => {
        setAvailability([...availability, { day: '', start_time: '', end_time: '' }]);
    };

    const handleAvailabilityRemove = (index) => {
        setAvailability(availability.filter((_, i) => i !== index));
    };

    const handleAvailabilityChange = (index, field, value) => {
        const updated = availability.map((slot, i) => 
            i === index ? { ...slot, [field]: value } : slot
        );
        setAvailability(updated);
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings || !Array.isArray(ratings) || ratings.length === 0) return '0.0';
        const total = ratings.reduce((sum, rating) => sum + (rating?.rating || 0), 0);
        return (total / ratings.length).toFixed(1);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>
                        {mode === 'view' ? 'Tutor Details' : 
                         mode === 'edit' ? 'Edit Tutor' : 'Create New Tutor'}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                
                {mode === 'view' ? (
                    <div className={styles.tutorDetailsView}>
                        <div className={styles.tutorImageSection}>
                            {tutor.image || tutor.user?.avatar ? (
                                <img src={tutor.image || tutor.user?.avatar} alt={tutor.name || tutor.user?.name} className={styles.tutorImageLarge} />
                            ) : (
                                <div className={styles.placeholderImageLarge}>👨‍🏫</div>
                            )}
                        </div>
                        
                        <div className={styles.tutorInfoGrid}>
                            <div className={styles.infoItem}>
                                <label>Tutor ID</label>
                                <span>#{tutor.id}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Name</label>
                                <span>{tutor.name || tutor.user?.name || 'N/A'}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Email</label>
                                <span>{tutor.user?.email || 'N/A'}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>University</label>
                                <span>{tutor.university || 'Not specified'}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Year</label>
                                <span>{tutor.year || 'Not specified'}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Experience</label>
                                <span>{tutor.experience_years || 0} years</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Hourly Rate</label>
                                <span>${tutor.hourly_rate || 0}/hour</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Contact</label>
                                <span>{tutor.contact || 'Not provided'}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Average Rating</label>
                                <span>⭐ {calculateAverageRating(tutor.ratings || [])} ({(tutor.ratings || []).length} reviews)</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Total Courses</label>
                                <span>{tutor.courses?.length || 0}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Bio</label>
                                <span>{tutor.bio || 'No bio provided'}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Created</label>
                                <span>{new Date(tutor.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Availability Section */}
                        {tutor.availability && tutor.availability.length > 0 && (
                            <div className={styles.availabilitySection}>
                                <h3>Availability</h3>
                                <div className={styles.availabilityGrid}>
                                    {tutor.availability.map((slot, index) => (
                                        <div key={index} className={styles.availabilitySlot}>
                                            <span className={styles.availabilityDay}>{slot.day}</span>
                                            <span className={styles.availabilityTime}>
                                                {slot.start_time} - {slot.end_time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Courses Section */}
                        {tutor.courses && tutor.courses.length > 0 && (
                            <div className={styles.coursesSection}>
                                <h3>Courses ({tutor.courses.length})</h3>
                                <div className={styles.coursesGrid}>
                                    {(tutor.courses || []).map((course, index) => (
                                        <div key={index} className={styles.courseCard}>
                                            <span className={styles.courseName}>{course.title || course.name}</span>
                                            <span className={styles.courseCode}>{course.code}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className={styles.modalActions}>
                            <button onClick={onClose} className={styles.cancelBtn}>
                                Close
                            </button>
                            <button 
                                onClick={() => setModalMode('edit')}
                                className={styles.editFromViewBtn}
                            >
                                Edit Tutor
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.modalForm}>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>User Account *</label>
                                <select
                                    value={formData.user_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                                    className={styles.modalSelect}
                                    required
                                    disabled={mode === 'edit'}
                                >
                                    <option value="">
                                        {availableUsers.length === 0 ? 
                                            'No users available (check admin permissions)' : 
                                            'Select a user'
                                        }
                                    </option>
                                    {availableUsers.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {availableUsers.length === 0 && (
                                    <small style={{color: '#ff6b7a', fontSize: '0.8rem', marginTop: '5px', display: 'block'}}>
                                        Unable to load users. Please ensure you have admin permissions and the backend is running.
                                    </small>
                                )}
                            </div>
                            
                            {availableUsers.length === 0 && (
                                <div className={styles.formGroup}>
                                    <label>User ID (Manual Entry) *</label>
                                    <input
                                        type="number"
                                        value={formData.user_id}
                                        onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                                        className={styles.modalInput}
                                        placeholder="Enter user ID manually"
                                        required
                                        min="1"
                                    />
                                    <small style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '5px', display: 'block'}}>
                                        Fallback: Enter the user ID number manually if user list doesn't load.
                                    </small>
                                </div>
                            )}
                            
                            <div className={styles.formGroup}>
                                <label>Display Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className={styles.modalInput}
                                    placeholder="Enter display name (optional)"
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>University</label>
                                <input
                                    type="text"
                                    value={formData.university}
                                    onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                                    className={styles.modalInput}
                                    placeholder="Enter university name"
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Year</label>
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                                    className={styles.modalInput}
                                    placeholder="Enter academic year"
                                    min="1"
                                    max="10"
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Experience (Years)</label>
                                <input
                                    type="number"
                                    value={formData.experience_years}
                                    onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                                    className={styles.modalInput}
                                    placeholder="Years of teaching experience"
                                    min="0"
                                    max="50"
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Hourly Rate ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.hourly_rate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                                    className={styles.modalInput}
                                    placeholder="Enter hourly rate"
                                    min="0"
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Contact</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                                    className={styles.modalInput}
                                    placeholder="Enter contact information"
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Profile Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={styles.modalInput}
                                    disabled={uploading}
                                />
                                {uploading && <span>Uploading...</span>}
                                {formData.image && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <img src={formData.image} alt="Category" style={{ maxWidth: 80, marginTop: 8 }} />
                                        
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className={styles.removeImageBtn}
                                            style={{
                                                marginLeft: 8,
                                                background: '#f44336',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 4,
                                                padding: '4px 8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                className={styles.modalTextarea}
                                placeholder="Enter tutor bio and qualifications"
                                rows={4}
                            />
                        </div>

                        {/* Availability Management */}
                        <div className={styles.availabilitySection}>
                            <div className={styles.sectionHeader}>
                                <h3>Availability Schedule</h3>
                                <button 
                                    type="button" 
                                    onClick={handleAvailabilityAdd}
                                    className={styles.addBtn}
                                >
                                    + Add Time Slot
                                </button>
                            </div>
                            <div className={styles.availabilityGrid}>
                                {availability.map((slot, index) => (
                                    <div key={index} className={styles.availabilitySlot}>
                                        <select
                                            value={slot.day || ''}
                                            onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                                            className={styles.availabilityDay}
                                        >
                                            <option value="">Select Day</option>
                                            <option value="Monday">Monday</option>
                                            <option value="Tuesday">Tuesday</option>
                                            <option value="Wednesday">Wednesday</option>
                                            <option value="Thursday">Thursday</option>
                                            <option value="Friday">Friday</option>
                                            <option value="Saturday">Saturday</option>
                                            <option value="Sunday">Sunday</option>
                                        </select>
                                        <input
                                            type="time"
                                            value={slot.start_time || ''}
                                            onChange={(e) => handleAvailabilityChange(index, 'start_time', e.target.value)}
                                            className={styles.availabilityTime}
                                        />
                                        <span className={styles.timeSeparator}>to</span>
                                        <input
                                            type="time"
                                            value={slot.end_time || ''}
                                            onChange={(e) => handleAvailabilityChange(index, 'end_time', e.target.value)}
                                            className={styles.availabilityTime}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAvailabilityRemove(index)}
                                            className={styles.removeBtn}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {availability.length === 0 && (
                                    <p className={styles.emptyMessage}>No availability slots added</p>
                                )}
                            </div>
                        </div>

                        {/* Course Assignment */}
                        <div className={styles.sectionGroup}>
                            <div className={styles.sectionHeader}>
                                <h3>Assigned Courses</h3>
                                <select
                                    onChange={handleCourseAdd}
                                    className={styles.courseSelect}
                                    value=""
                                >
                                    <option value="">+ Assign Course</option>
                                    {courses.filter(course => 
                                        !tutorCourses.some(tc => tc.id === course.id)
                                    ).map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title} ({course.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.coursesList}>
                                {tutorCourses.map((course, index) => (
                                    <div key={course.id || index} className={styles.courseItem}>
                                        <span className={styles.courseTitle}>
                                            {course.title || course.name}
                                        </span>
                                        <span className={styles.courseCode}>
                                            {course.code}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleCourseRemove(index)}
                                            className={styles.removeBtn}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {tutorCourses.length === 0 && (
                                    <p className={styles.emptyMessage}>No courses assigned</p>
                                )}
                            </div>
                        </div>
                        
                        <div className={styles.modalActions}>
                            <button type="button" onClick={onClose} className={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className={styles.saveBtn}>
                                {loading ? 'Saving...' : (mode === 'create' ? 'Create Tutor' : 'Save Changes')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ tutor, onConfirm, onCancel }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div className={styles.deleteModal} onClick={e => e.stopPropagation()}>
                <div className={styles.deleteModalHeader}>
                    <h2>Confirm Delete</h2>
                </div>
                
                <div className={styles.deleteModalContent}>
                    <p>Are you sure you want to delete this tutor?</p>
                    <div className={styles.tutorPreview}>
                        <strong>{tutor.name || tutor.user?.name || 'Unknown Tutor'}</strong><br />
                        <span>{tutor.university || 'No university'}</span><br />
                        <span>Courses: {tutor.courses ? tutor.courses.length : 0}</span><br />
                        <span>Experience: {tutor.experience_years || 0} years</span>
                    </div>
                    <p className={styles.warning}>This action cannot be undone and will affect associated courses and ratings.</p>
                </div>
                
                <div className={styles.deleteModalActions}>
                    <button onClick={onCancel} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={loading} 
                        className={styles.deleteConfirmBtn}
                    >
                        {loading ? 'Deleting...' : 'Delete Tutor'}
                    </button>
                </div>
            </div>
        </div>
    );
}
