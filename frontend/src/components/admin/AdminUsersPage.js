import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminUsersPage.css';
import api from '../../api/api';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('');
    const [newRole, setNewRole] = useState('');
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
            setShowModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user');
        }
    };

    if (loading) return <div className="loading">Loading users...</div>;

    return (
        <div className="admin-page">
            <h1 className="admin-title">Admin Dashboard</h1>
            
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
            
            <div className="admin-users-section">
                <h2>Manage Users</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                {users.length === 0 ? (
                    <div className="no-users">No users found</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className={`role-${user.role.toLowerCase()}`}>{user.role}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleRoleChange(user)}
                                        >
                                            Change Role
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDeleteUser(user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            {modalMode === 'role' ? (
                                <>
                                    <h3>Update User Role</h3>
                                    <p>Change role for {selectedUser.name} ({selectedUser.email})</p>
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
                                            className="confirm-btn"
                                            onClick={confirmRoleUpdate}
                                        >
                                            Update Role
                                        </button>
                                        <button 
                                            className="cancel-btn"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3>Delete User</h3>
                                    <p>Are you sure you want to delete {selectedUser.name}?</p>
                                    <p>This action cannot be undone.</p>
                                    <div className="modal-actions">
                                        <button 
                                            className="delete-btn"
                                            onClick={confirmDeleteUser}
                                        >
                                            Delete User
                                        </button>
                                        <button 
                                            className="cancel-btn"
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
