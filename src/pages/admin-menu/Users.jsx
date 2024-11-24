import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { Skeleton } from "@/components/ui/skeleton";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://stoxii-backend.vercel.app/api/v1/users/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on the search term
    const filteredUsers = users.filter((user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-2 sm:p-4 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                    <Skeleton className="h-8 w-32 bg-gray-700" />
                    <Skeleton className="h-12 w-full sm:w-1/3 bg-gray-700" />
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 p-4">
                                <Skeleton className="h-6 w-full sm:w-1/6 bg-gray-700" />
                                <Skeleton className="h-6 w-full sm:w-1/4 bg-gray-700" />
                                <Skeleton className="h-6 w-full sm:w-1/3 bg-gray-700" />
                                <Skeleton className="h-6 w-full sm:w-1/6 bg-gray-700" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-2 sm:p-4">
                <div className="text-red-500 bg-red-100 border-l-4 border-red-500 rounded-lg p-4">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-4 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Users</h2>

                {/* Search Bar with Material Icon */}
                <div className="relative w-full sm:w-1/3 flex items-center">
                    <SearchIcon className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-8 py-2 sm:py-3 w-full rounded-lg bg-gray-700 text-white focus:outline-none pl-10"
                    />
                </div>
            </div>

            {/* Responsive table/card layout */}
            <div className="w-full">
                {/* Desktop view - Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredUsers?.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-700 transition duration-200">
                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">{user._id}</td>
                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">{user.firstName} {user.lastName}</td>
                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">{user.email}</td>
                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">+91 {user.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile view - Cards */}
                <div className="sm:hidden space-y-4">
                    {filteredUsers?.map((user) => (
                        <div key={user._id} className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">ID:</span>
                                <span className="text-gray-300 text-sm">{user._id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Name:</span>
                                <span className="text-gray-300 text-sm">{user.firstName} {user.lastName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Email:</span>
                                <span className="text-gray-300 text-sm">{user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Phone:</span>
                                <span className="text-gray-300 text-sm">+91 {user.phone}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Users;
