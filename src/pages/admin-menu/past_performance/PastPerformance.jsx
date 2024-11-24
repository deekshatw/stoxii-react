import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust the path to your Skeleton component
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Save, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import toast from "react-hot-toast";

const PastPerformance = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [exitedCalls, setExitedCalls] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://stoxii-backend.vercel.app/api/v1/past-performance/all"
                );
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error("Failed to fetch data");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchExitedCalls = async () => {
            try {
                const response = await fetch(
                    "https://stoxii-backend.vercel.app/api/v1/exited-calls/all?type=past-performance"
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data?.data) {
                    setExitedCalls(data.data);
                }
            } catch (err) {
                setError("Failed to fetch exited calls");
            }
        };

        fetchData();
        fetchExitedCalls();
    }, []);

    if (loading) {
        return (
            <div className="p-6 bg-gray-900">
                {/* Skeleton loader */}
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full mb-4 bg-gray-700" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    const filteredCalls = exitedCalls.filter((call) =>
        call.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-6">Past Performance</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by Ticker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-6 p-3 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            />

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <p className="text-sm text-gray-400">Total Calls</p>
                    <h3 className="text-xl font-bold">{data?.totalCalls}</h3>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <p className="text-sm text-gray-400">Success Rate</p>
                    <h3 className="text-xl font-bold">{data?.successRate}%</h3>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <p className="text-sm text-gray-400">Average Duration</p>
                    <h3 className="text-xl font-bold">{data?.averageDuration}</h3>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <p className="text-sm text-gray-400">Annual Returns</p>
                    <h3 className="text-xl font-bold">{data?.annualReturns}%</h3>
                </div>
            </div>

            {/* Exited Calls Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Exited Calls</h2>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate('/past-performance/exited-call/add')} // Navigate to the new page on click
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Exited Call
                </Button>
            </div>

            {filteredCalls.length > 0 ? (
                <div className="w-full">
                    {/* Desktop view - Table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticker</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Recommended Price</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Return %</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date of Rec.</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sell Price</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sell Date</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Annual Returns</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredCalls.map((call) => (
                                    <tr key={call._id} className="hover:bg-gray-700 transition duration-200">
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300 font-medium">{call.ticker}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">₹{call.recommendedPrice}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">{call.returnPercentage}%</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">{call.duration} {call.durationType}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">
                                            {new Date(call.dateOfRecommendation).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">₹{call.sellPrice}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">
                                            {new Date(call.sellDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">{call.annualReturns}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile view - Cards */}
                    <div className="sm:hidden space-y-4">
                        {filteredCalls.map((call) => (
                            <div key={call._id} className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Ticker:</span>
                                    <span className="text-gray-300 text-sm font-medium">{call.ticker}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Recommended Price:</span>
                                    <span className="text-gray-300 text-sm font-medium">₹{call.recommendedPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Return %:</span>
                                    <span className="text-gray-300 text-sm font-medium">{call.returnPercentage}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Duration:</span>
                                    <span className="text-gray-300 text-sm font-medium">{call.duration} {call.durationType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Date of Rec.:</span>
                                    <span className="text-gray-300 text-sm font-medium">
                                        {new Date(call.dateOfRecommendation).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-700 p-6 rounded-lg text-gray-300">
                    No exited calls found.
                </div>
            )}
        </div>
    );
};

export default PastPerformance;
