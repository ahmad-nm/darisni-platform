import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import styles from "./UserManagement.module.css";
import { navigate } from "@/utils/navigationService";
import { ROUTES } from "@/constants/routes";
import { deleteUser, updateUser} from "../../../services/admin/userManagementService";
import UserModal from "./components/UserModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import UserTable from "./components/UserTable";
import UserStats from "./components/UsersStats";
import UserFilters from "./components/UserFilters";
import UserPagination from "./components/UserPagination";

export default function UserManagement({
    users: initialUsers,
    stats: initialStats,
}) {
    const [users, setUsers] = useState(initialUsers || []);
    const [filteredUsers, setFilteredUsers] = useState(initialUsers || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMode, setModalMode] = useState("view"); // 'view', 'edit'
    const [stats] = useState(initialStats || {});
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
            filtered = filtered.filter(
                (user) =>
                    user.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    user.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            );
        }

        // Filter by role
        if (selectedRole !== "all") {
            filtered = filtered.filter((user) => user.role === selectedRole);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchQuery, selectedRole, users]);

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleDeleteUser = async (userId) => {
        setSelectedUser(users.find((user) => user.id === userId));
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!selectedUser) return;

        setLoading(true);
        deleteUser(selectedUser.id, {
            preserveScroll: true,
            onSuccess: () => {
                // Remove user from local state
                const updatedUsers = users.filter(
                    (user) => user.id !== selectedUser.id,
                );
                setUsers(updatedUsers);
                setFilteredUsers(
                    updatedUsers.filter((user) => {
                        const matchesSearch =
                            user.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            user.email
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase());
                        const matchesRole =
                            selectedRole === "all" ||
                            user.role === selectedRole;
                        return matchesSearch && matchesRole;
                    }),
                );
                setShowDeleteModal(false);
                setSelectedUser(null);
            },
            onError: (errors) => {
                alert("Failed to delete user");
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setModalMode("view");
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setModalMode("edit");
        setShowUserModal(true);
    };

    const handleUpdateUser = async (payload) => {
        setLoading(true);

        updateUser(selectedUser.id, payload, {
            onSuccess: () => {
                router.reload();
                setShowUserModal(false);
                setSelectedUser(null);
            },
            onError: () => alert("Failed to update user"),
            onFinish: () => setLoading(false),
        });
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
                                <h1 className={styles.title}>
                                    User Management
                                </h1>
                                <p className={styles.subtitle}>
                                    Manage all users on your platform
                                </p>
                            </div>
                            <button
                                className={styles.addUserButton}
                                onClick={() =>
                                    navigate(ROUTES.ADMIN_USER_CREATE)
                                }
                            >
                                + Add New User
                            </button>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <UserFilters
                        searchQuery={searchQuery}
                        selectedRole={selectedRole}
                        onSearchChange={handleSearchChange}
                        onRoleChange={handleRoleChange}
                    />

                    {/* Stats */}
                    <UserStats stats={stats} users={filteredUsers} />

                    {/* Users Table */}
                    <UserTable
                        users={currentUsers}
                        onEdit={handleEditUser}
                        onView={handleViewUser}
                        onDelete={handleDeleteUser}
                    />

                    {/* Pagination */}
                    <UserPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />

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
                            setModalMode("view");
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