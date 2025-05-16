import React from 'react';
import axios from 'axios';

const UserRow = ({ user, refresh }) => {
    const handleDelete = async () => {
        if (window.confirm('Delete this user?')) {
            await axios.delete(`/api/admin/users/${user._id}`, { withCredentials: true });
            refresh();
        }
    };

    const handleRoleUpdate = async () => {
        const newRole = window.prompt('Enter new role (User, Organizer, Admin)', user.role);
        if (newRole && newRole !== user.role) {
            await axios.put(`/api/admin/users/${user._id}/role`, { role: newRole }, { withCredentials: true });
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
