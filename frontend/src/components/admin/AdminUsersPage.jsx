import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminUsersPage.css';
import api from '../../api/api';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('');
    const [newRole, setNewRole] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            if (res.data.success) {
                setUsers(res.data.data);
            } else {
                setError('Failed to load users');
            }
        } catch (err) {
            console.error('Failed to load users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleTabChange = (tab) => {
        navigate(tab === 'users' ? '/admin/users' : '/admin/events');
    };

    const handleRoleChange = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setModalMode('role');
        setShowModal(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setModalMode('delete');
        setShowModal(true);
    };

    const confirmRoleUpdate = async () => {
        try {
            await api.put(`/users/${selectedUser.id}`, { role: newRole });
            setSuccess('User role updated successfully');
            setShowModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error('Failed to update user role:', err);
            setError('Failed to update user role');
        }
    };

    const confirmDeleteUser = async () => {
        try {
            await api.delete(`/users/${selectedUser.id}`);
            setSuccess('User deleted successfully');
            setShowModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => 
        filterRole === 'all' || user.role.toLowerCase() === filterRole
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-container">
                    <div className="loading">Loading users...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                {/* Header */}
                <div className="admin-header">
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-subtitle">Manage your platform users and events</p>
                </div>

                {/* Navigation Tabs */}
                <div className="admin-tabs">
                    <button 
                        className="tab-button"
                        onClick={() => handleTabChange('events')}
                    >
                        Events Management
                    </button>
                    <button 
                        className="tab-button active"
                        onClick={() => handleTabChange('users')}
                    >
                        User Management
                    </button>
                </div>

                {/* Main Content */}
                <div className="admin-content-card">
                    <div className="content-header">
                        <h2 className="content-title">User Management</h2>
                        <div className="user-stats">
                            <span className="stat-item">
                                Total Users: <strong>{users.length}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="filter-section">
                        <div className="filter-buttons">
                            <button 
                                className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterRole('all')}
                            >
                                All Users ({users.length})
                            </button>
                            <button 
                                className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
                                onClick={() => setFilterRole('admin')}
                            >
                                Admins ({users.filter(u => u.role === 'admin').length})
                            </button>
                            <button 
                                className={`filter-btn ${filterRole === 'organizer' ? 'active' : ''}`}
                                onClick={() => setFilterRole('organizer')}
                            >
                                Organizers ({users.filter(u => u.role === 'organizer').length})
                            </button>
                            <button 
                                className={`filter-btn ${filterRole === 'user' ? 'active' : ''}`}
                                onClick={() => setFilterRole('user')}
                            >
                                Users ({users.filter(u => u.role === 'user').length})
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    {/* Users Table */}
                    {filteredUsers.length === 0 ? (
                        <div className="no-data">
                            <h3>No users found</h3>
                            <p>No users match your current filter criteria.</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User Details</th>
                                        <th>Role</th>
                                        <th>Joined Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-name">{user.name}</div>
                                                    <div className="user-email">{user.email}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{formatDate(user.createdAt)}</td>
                                            <td>
                                                <div className="actions">
                                                    <button 
                                                        className="action-btn edit-btn"
                                                        onClick={() => handleRoleChange(user)}
                                                    >
                                                        Change Role
                                                    </button>
                                                    <button 
                                                        className="action-btn delete-btn"
                                                        onClick={() => handleDeleteUser(user)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            {modalMode === 'role' ? (
                                <>
                                    <h3>Update User Role</h3>
                                    <p>
                                        Change role for <strong>{selectedUser.name}</strong>
                                        <br />
                                        <span style={{ color: '#666' }}>({selectedUser.email})</span>
                                    </p>
                                    <div className="role-selector">
                                        <select 
                                            value={newRole} 
                                            onChange={(e) => setNewRole(e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="organizer">Organizer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions">
                                        <button 
                                            className="modal-btn confirm-btn"
                                            onClick={confirmRoleUpdate}
                                        >
                                            Update Role
                                        </button>
                                        <button 
                                            className="modal-btn cancel-btn"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3>Delete User</h3>
                                    <p>
                                        Are you sure you want to delete <strong>{selectedUser.name}</strong>?
                                    </p>
                                    <p style={{ color: '#ef4444', fontWeight: '500' }}>
                                        This action cannot be undone and will permanently remove all user data.
                                    </p>
                                    <div className="modal-actions">
                                        <button 
                                            className="modal-btn confirm-btn"
                                            onClick={confirmDeleteUser}
                                            style={{ background: '#ef4444' }}
                                        >
                                            Delete User
                                        </button>
                                        <button 
                                            className="modal-btn cancel-btn"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;