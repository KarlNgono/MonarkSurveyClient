'use client'

import { useEffect, useState } from "react";

interface SurveyItem {
    id: string;
    name: string;
    json: any;
}

export default function SurveyList() {
    const [surveys, setSurveys] = useState<SurveyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [newSurveyName, setNewSurveyName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    const itemsPerPage = 4;
    const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

    useEffect(() => { fetchSurveys(); }, []);

    async function fetchSurveys() {
        try {
            const res = await fetch(`${apiBaseUrl}/getActive`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setSurveys(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function createSurvey() {
        if (!newSurveyName.trim()) return alert("Survey name is required");
        try {
            const res = await fetch(`${apiBaseUrl}/create?name=${encodeURIComponent(newSurveyName)}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const newSurvey = await res.json();
            setSurveys(prev => [...prev, newSurvey]);
            setModalOpen(false);
            setNewSurveyName("");
            alert("Survey created");
        } catch (err: any) {
            setError(err.message);
        }
    }

    async function deleteSurvey(id: string) {
        if (!confirm("Are you sure you want to delete this survey?")) return;
        try {
            const res = await fetch(`${apiBaseUrl}/delete?id=${id}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            setSurveys(prev => prev.filter(s => s.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    }

    async function saveName(id: string) {
        if (!editingName.trim()) return alert("Name cannot be empty");
        try {
            await fetch(`${apiBaseUrl}/changeName?id=${id}&name=${encodeURIComponent(editingName)}`);
            setSurveys(prev => prev.map(s => s.id === id ? { ...s, name: editingName } : s));
        } catch (err) {
            alert("Error saving name");
            console.error(err);
        } finally {
            setEditingId(null);
        }
    }

    const filteredSurveys = surveys.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
    const paginatedSurveys = filteredSurveys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <p>Loading surveys...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold">Active Surveys</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded w-full sm:w-auto"
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => setModalOpen(true)}
                    >
                        Create Survey
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto w-full rounded shadow">
                <table className="min-w-[400px] w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Name</th>
                        <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedSurveys.map(survey => (
                        <tr key={survey.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">
                                {editingId === survey.id ? (
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={e => setEditingName(e.target.value)}
                                        onBlur={() => saveName(survey.id)}
                                        onKeyDown={e => e.key === "Enter" && saveName(survey.id)}
                                        className="border-b border-gray-300 px-1 py-0.5 rounded w-full text-sm"
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                        onDoubleClick={() => { setEditingId(survey.id); setEditingName(survey.name); }}
                                        className="cursor-pointer"
                                    >
                      {survey.name}
                    </span>
                                )}
                            </td>
                            <td className="py-2 px-4 border-b flex flex-wrap justify-center gap-1">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded text-sm shadow-sm hover:bg-green-600 hover:scale-105 transition-transform"
                                    onClick={() => window.location.href = `/preview/${survey.id}`}
                                >
                                    Preview
                                </button>
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm shadow-sm hover:bg-yellow-600 hover:scale-105 transition-transform"
                                    onClick={() => window.location.href = `/edit/${survey.id}`}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm shadow-sm hover:bg-red-600 hover:scale-105 transition-transform"
                                    onClick={() => deleteSurvey(survey.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {paginatedSurveys.length === 0 && (
                        <tr>
                            <td colSpan={2} className="py-4 text-center text-gray-500">
                                No surveys found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                <button
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} / {totalPages || 1}</span>
                <button
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Create a Survey</h3>
                        <input
                            type="text"
                            placeholder="Survey Name"
                            value={newSurveyName}
                            onChange={e => setNewSurveyName(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => { setModalOpen(false); setNewSurveyName(""); }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={createSurvey}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
