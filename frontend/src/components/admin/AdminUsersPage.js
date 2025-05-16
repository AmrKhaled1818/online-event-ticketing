import React, { useEffect, useState } from 'react';
import './AdminUsersPage.css';
import UserRow from './UserRow';
import axios from 'axios';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users', { withCredentials: true });
            setUsers(res.data);
        } catch {
            console.error('Failed to load users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="admin-users-page">
            <h2>Manage Users</h2>
            <table>
                <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <UserRow key={user._id} user={user} refresh={fetchUsers} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersPage;
