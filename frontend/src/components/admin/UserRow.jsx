import React from 'react';
import api from '../../api/api';

const UserRow = ({ user, refresh }) => {
    const handleDelete = async () => {
        if (window.confirm('Delete this user?')) {
            await api.delete(`/admin/users/${user._id}`);
            refresh();
        }
    };

    const handleRoleUpdate = async () => {
        const newRole = window.prompt('Enter new role (User, Organizer, Admin)', user.role);
        if (newRole && newRole !== user.role) {
            await api.put(`/admin/users/${user._id}/role`, { role: newRole });
            refresh();
        }
    };

    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
                <button onClick={handleRoleUpdate}>Update Role</button>
                <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
            </td>
        </tr>
    );
};

export default UserRow;
