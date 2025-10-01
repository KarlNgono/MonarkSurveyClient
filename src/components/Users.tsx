'use client';

import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

    useEffect(() => { fetchUsers(); }, []);

    async function fetchUsers() {
        const res = await fetch(`${apiBaseUrl}/getUsers`);
        const data = await res.json();
        setUsers(data);
    }

    function openAddModal() {
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "" });
        setModalOpen(true);
    }

    function openEditModal(user: User) {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: "" });
        setModalOpen(true);
    }

    async function submitForm() {
        if (!formData.name || !formData.email || (!editingUser && !formData.password))
            return alert("All fields are required");

        if (editingUser) {
            await fetch(`${apiBaseUrl}/updateUser/${editingUser.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        } else {
            await fetch(`${apiBaseUrl}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        }

        setModalOpen(false);
        fetchUsers();
    }

    async function deleteUser(id: number) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        await fetch(`${apiBaseUrl}/users/${id}`, { method: "DELETE" });
        fetchUsers();
    }

    const filteredUsers = users.filter(
        u => u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold">Users</h2>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full sm:w-1/3"
                />
            </div>

            <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[500px] border-collapse border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Email</th>
                        <th className="border p-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2 space-x-2 flex flex-wrap">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => openEditModal(user)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={openAddModal}
            >
                Add User
            </button>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-6">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md sm:max-w-lg">
                        <h3 className="text-xl font-bold mb-4">
                            {editingUser ? "Edit User" : "Add User"}
                        </h3>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                            {!editingUser && (
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="border p-2 rounded w-full"
                                />
                            )}
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={submitForm}
                            >
                                {editingUser ? "Edit" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
