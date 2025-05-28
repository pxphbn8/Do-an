import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./ManageUsers.css";

const ManageUsers = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch user data from the API
    useEffect(() => {
        // Get the list of users from the API
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/tk");
                if (!response.ok) {
                    throw new Error("Failed to fetch users.");
                }
                const data = await response.json();

                // Filter users by the 'User' role
                const filteredUsers = data.filter(user => user.role === "User");
                setUsers(filteredUsers);

                // Optionally, get the currently logged-in user
                const loggedInUser = JSON.parse(localStorage.getItem("user"));
                setCurrentUser(loggedInUser);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []); // Empty dependency array ensures it only runs once after the initial render

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Danh sách tài khoản</h2>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Không có tài khoản nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <NavLink to="/Admin" className="btn btn-primary">
                    Cancel
                </NavLink>
            </div>
        </div>
    );
};

export default ManageUsers;
