import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import styles from './UserManagement.module.css';

export default function UserManagement({ users: initialUsers, stats: initialStats }) {
    const [users, setUsers] = useState(initialUsers || []);
    const [filteredUsers, setFilteredUsers] = useState(initialUsers || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit'
    const [stats, setStats] = useState(initialStats || {});
    const usersPerPage = 10;

    // Update users and filtered users when initialUsers prop changes
    useEffect(() => {
        if (initialUsers && initialUsers.length > 0) {
            setUsers(initialUsers);
            setFilteredUsers(initialUsers);
        }
    }, [initialUsers]);

    // Filter users based on search and role
    useEffect(() => {
        let filtered = users;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by role
        if (selectedRole !== 'all') {
            filtered = filtered.filter(user => user.role === selectedRole);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchQuery, selectedRole, users]);

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleDeleteUser = async (userId) => {
        setSelectedUser(users.find(user => user.id === userId));
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!selectedUser) return;

        setLoading(true);
        router.delete(route('admin.users.destroy', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Remove user from local state
                const updatedUsers = users.filter(user => user.id !== selectedUser.id);
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers.filter(user => {
                    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        user.email.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
                    return matchesSearch && matchesRole;
                }));
                setShowDeleteModal(false);
                setSelectedUser(null);
            },
            onError: (errors) => {
                alert('Failed to delete user');
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setModalMode('view');
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setModalMode('edit');
        setShowUserModal(true);
    };

    const handleUpdateUser = async (payload) => {
        setLoading(true);

        const isFormData = payload instanceof FormData;

        if (isFormData) {
            router.post(route('admin.users.update', selectedUser.id), payload, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    router.reload();
                    setShowUserModal(false);
                    setSelectedUser(null);
                },
                onError: () => alert('Failed to update user'),
                onFinish: () => setLoading(false),
            });
        } else {
            router.put(route('admin.users.update', selectedUser.id), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                    setShowUserModal(false);
                    setSelectedUser(null);
                },
                onError: () => alert('Failed to update user'),
                onFinish: () => setLoading(false),
            });
        }
    };

    const getStatusBadge = (user) => {
        const isActive = user.email_verified_at !== null;
        const status = isActive ? 'active' : 'inactive';
        const statusText = isActive ? 'Active' : 'Inactive';
        const statusClass = isActive ? styles.statusActive : styles.statusInactive;
        return <span className={`${styles.statusBadge} ${statusClass}`}>{statusText}</span>;
    };

    const getRoleBadge = (role) => {
        const roleClass = role === 'admin' ? styles.roleAdmin : 
                         role === 'tutor' ? styles.roleTutor : 
                         styles.roleStudent;
        return <span className={`${styles.roleBadge} ${roleClass}`}>{role}</span>;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.pageContainer}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading users...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <Head title="User Management" />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div>
                                <h1 className={styles.title}>User Management</h1>
                                <p className={styles.subtitle}>Manage all users on your platform</p>
                            </div>
                            <button 
                                className={styles.addUserButton}
                                onClick={() => router.visit('/admin/users/create')}
                            >
                                + Add New User
                            </button>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className={styles.filtersContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className={styles.searchInput}
                            />
                            <div className={styles.searchIcon}>🔍</div>
                        </div>

                        <div className={styles.filterContainer}>
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                className={styles.roleFilter}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="tutor">Tutor</option>
                                <option value="student">Student</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{filteredUsers.length}</span>
                            <span className={styles.statLabel}>Total Users</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{stats.active || filteredUsers.filter(u => u.email_verified_at !== null).length}</span>
                            <span className={styles.statLabel}>Active</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{stats.tutors || filteredUsers.filter(u => u.role === 'tutor').length}</span>
                            <span className={styles.statLabel}>Tutors</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{filteredUsers.filter(u => u.email_verified_at === null).length}</span>
                            <span className={styles.statLabel}>Unverified</span>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className={styles.tableContainer}>
                        <table className={styles.usersTable}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Verified</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map(user => (
                                    <tr key={user.id} className={styles.userRow}>
                                        <td className={styles.userInfo}>
                                            <div className={styles.userAvatar}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={styles.userDetails}>
                                                <div className={styles.userName}>{user.name}</div>
                                                <div className={styles.userEmail}>{user.email}</div>
                                            </div>
                                        </td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>{getStatusBadge(user)}</td>
                                        <td>
                                            <span className={user.email_verified_at ? styles.verified : styles.unverified}>
                                                {user.email_verified_at ? '✓ Verified' : '✗ Unverified'}
                                            </span>
                                        </td>
                                        <td className={styles.joinDate}>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button 
                                                    className={styles.editBtn} 
                                                    title="Edit User"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className={styles.viewBtn} 
                                                    title="View Details"
                                                    onClick={() => handleViewUser(user)}
                                                >
                                                    👁️
                                                </button>
                                                <button 
                                                    className={styles.deleteBtn} 
                                                    title="Delete User"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

                    {filteredUsers.length === 0 && (
                        <div className={styles.noResults}>
                            <p>No users found matching your search criteria.</p>
                        </div>
                    )}
                </div>

                {/* User Details/Edit Modal */}
                {showUserModal && selectedUser && (
                    <UserModal
                        user={selectedUser}
                        mode={modalMode}
                        onClose={() => {
                            setShowUserModal(false);
                            setSelectedUser(null);
                            setModalMode('view');
                        }}
                        onUpdate={handleUpdateUser}
                        setModalMode={setModalMode}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedUser && (
                    <DeleteConfirmationModal
                        user={selectedUser}
                        onConfirm={confirmDeleteUser}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setSelectedUser(null);
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

// User Details/Edit Modal Component
function UserModal({ user, mode, onClose, onUpdate, setModalMode }) {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        email_verified_at: !!user.email_verified_at,
        image: user.image || '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const response = await fetch('/admin/users/upload-image', {
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

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'view') return;
        
        setLoading(true);

        let payload;
        if (formData.image && typeof formData.image !== 'string') {
            // New image file selected
            payload = new FormData();
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('role', formData.role);
            payload.append('email_verified_at', formData.email_verified_at ? 1 : 0);
            payload.append('image', formData.image);

            // 👇 CRUCIAL: tell Laravel this is PUT
            payload.append('_method', 'PUT');

            console.log('FormData payload:');
            for (let pair of payload.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }
        } else {
            // No new image, don’t send image at all
            payload = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                email_verified_at: formData.email_verified_at ? 1 : 0,
            };
            console.log('JSON payload:', payload);
        }

        await onUpdate(payload);
        setLoading(false);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{mode === 'view' ? 'User Details' : 'Edit User'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                
                {mode === 'view' ? (
                    <div className={styles.userDetailsView}>
                        <div className={styles.userProfileSection}>
                            <div className={styles.userAvatarLarge}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.userBasicInfo}>
                                <h3>{user.name}</h3>
                                <p className={styles.userEmailLarge}>{user.email}</p>
                                <span className={`${styles.userRoleBadge} ${styles['role' + user.role.charAt(0).toUpperCase() + user.role.slice(1)]}`}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        
                        <div className={styles.userInfoGrid}>
                            <div className={styles.infoItem}>
                                <label>User ID</label>
                                <span>#{user.id}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Account Status</label>
                                <span className={`${styles.statusIndicator} ${user.email_verified_at !== null ? styles.statusActive : styles.statusInactive}`}>
                                    {user.email_verified_at !== null ? '✓ Active' : '✗ Inactive'}
                                </span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Email Verification</label>
                                <span className={`${styles.verificationStatus} ${user.email_verified_at ? styles.verified : styles.unverified}`}>
                                    {user.email_verified_at ? '✓ Verified' : '✗ Unverified'}
                                </span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Email Verified At</label>
                                <span>
                                    {user.email_verified_at 
                                        ? new Date(user.email_verified_at).toLocaleString()
                                        : 'Not verified'
                                    }
                                </span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Member Since</label>
                                <span>{new Date(user.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Last Updated</label>
                                <span>{new Date(user.updated_at || user.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Account Age</label>
                                <span>
                                    {Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24))} days
                                </span>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <label>Profile Image</label>
                                <span>{user.image ? 'Has profile picture' : 'No profile picture'}</span>
                            </div>
                        </div>
                        
                        <div className={styles.modalActions}>
                            <button onClick={onClose} className={styles.cancelBtn}>
                                Close
                            </button>
                            <button 
                                onClick={() => {
                                    setModalMode('edit');
                                }} 
                                className={styles.editFromViewBtn}
                            >
                                Edit User
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.modalForm}>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={styles.modalInput}
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className={styles.modalInput}
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                className={styles.modalInput}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="tutor">Tutor</option>
                                <option value="student">Student</option>
                            </select>
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
                                    <img src={formData.image} alt="User" style={{ maxWidth: 80, marginTop: 8 }} />
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

                        <div className={styles.formGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={formData.email_verified_at}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email_verified_at: e.target.checked }))}
                                />
                                Email Verified
                            </label>
                        </div>
                        
                        <div className={styles.modalActions}>
                            <button type="button" onClick={onClose} className={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className={styles.saveBtn}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ user, onConfirm, onCancel }) {
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
                    <p>Are you sure you want to delete this user?</p>
                    <div className={styles.userPreview}>
                        <strong>{user.name}</strong><br />
                        <span>{user.email}</span><br />
                        <span className={styles.roleTag}>{user.role}</span>
                    </div>
                    <p className={styles.warning}>This action cannot be undone.</p>
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
                        {loading ? 'Deleting...' : 'Delete User'}
                    </button>
                </div>
            </div>
        </div>
    );
}
