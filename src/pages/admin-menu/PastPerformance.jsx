import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust the path to your Skeleton component
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Save, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const PastPerformance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [isSaving, setIsSaving] = useState(false); // For saving loader

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://stoxii-backend.vercel.app/api/v1/past-performance/all");
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                    setEditedData(result.data);
                } else {
                    throw new Error("Failed to fetch data");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditedData(data);
    };

    const handleSave = async () => {
        setIsSaving(true); // Show loader on save
        const savePromise = axios.post(
            "https://stoxii-backend.vercel.app/api/v1/past-performance/add",
            {
                totalCalls: editedData.totalCalls,
                exitedCalls: editedData.exitedCalls,
                successRate: editedData.successRate,
                averageDuration: editedData.averageDuration,
                annualReturns: editedData.annualReturns,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        toast.promise(
            savePromise,
            {
                loading: "Saving data...",
                success: "Data updated successfully!",
                error: "Failed to save data!",
            },
            { position: "top-right" }
        );

        try {
            const response = await savePromise;
            if (response.data.success) {
                setData(editedData);
                setEditMode(false);
            }
        } catch (err) {
            // Error is already handled by toast
        } finally {
            setIsSaving(false); // Hide loader
        }
    };

    const handleChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-900">
                <h1 className="text-2xl font-bold mb-6 text-white">Past Performance</h1>
                <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="mb-4">
                                <Skeleton className="h-6 w-1/3 mb-2 bg-gray-700" />
                                <Skeleton className="h-4 w-2/3 bg-gray-700" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Past Performance</h1>
                {!editMode ? (
                    <Button onClick={handleEdit} variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-800">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                ) : (
                    <div className="space-x-2">
                        <Button
                            onClick={handleSave}
                            variant="default"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                </>
                            )}
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-800">
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
                <CardContent className="p-6 space-y-4">
                    {editMode ? (
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Total Calls"
                                value={editedData.totalCalls}
                                onChange={(value) => handleChange('totalCalls', value)}
                            />
                            <InputField
                                label="Exited Calls"
                                value={editedData.exitedCalls}
                                onChange={(value) => handleChange('exitedCalls', value)}
                            />
                            <InputField
                                label="Success Rate"
                                value={editedData.successRate}
                                onChange={(value) => handleChange('successRate', value)}
                            />
                            <InputField
                                label="Average Duration"
                                value={editedData.averageDuration}
                                onChange={(value) => handleChange('averageDuration', value)}
                            />
                            <InputField
                                label="Annual Returns"
                                value={editedData.annualReturns}
                                onChange={(value) => handleChange('annualReturns', value)}
                            />
                        </div>
                    ) : (
                        <DisplayData data={{
                            "Total Calls": data.totalCalls,
                            "Exited Calls": data.exitedCalls,
                            "Success Rate": data.successRate,
                            "Average Duration": data.averageDuration,
                            "Annual Returns": data.annualReturns,
                        }} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const InputField = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>
        <input
            type="text"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const DisplayData = ({ data }) => (
    <div className="space-y-4 text-white">
        {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="font-medium">{key}</span>
                <span>{value}</span>
            </div>
        ))}
    </div>
);

export default PastPerformance;
