import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory

const AddExitedCall = () => {
    const [formData, setFormData] = useState({
        ticker: "",
        recommendedPrice: "",
        returnPercentage: "",
        duration: "",
        dateOfRecommendation: new Date(),
        sellPrice: "",
        sellDate: new Date(),
        annualReturns: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
    const [successMessage, setSuccessMessage] = useState(""); // Track success message
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date, field) => {
        setFormData({
            ...formData,
            [field]: date,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true); // Set submitting state to true
        setSuccessMessage(""); // Clear any previous success message

        const payload = {
            ...formData,
            dateOfRecommendation: formData.dateOfRecommendation.toISOString(),
            sellDate: formData.sellDate.toISOString(),
            callType: "past-performance", // static value
        };

        try {
            const response = await fetch("https://stoxii-backend.vercel.app/api/v1/exited-calls/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to submit the form");
            }

            const data = await response.json();
            console.log("Form submitted successfully:", data);

            setSuccessMessage("Form submitted successfully!"); // Show success message
            setIsSubmitting(false); // Reset submitting state

            // Navigate back to the previous page
            setTimeout(() => {
                navigate(-1); // Use navigate(-1) to go back to the previous page
            }, 1500); // Delay to allow users to see the success message

        } catch (error) {
            console.error("Error:", error);
            setIsSubmitting(false); // Reset submitting state if an error occurs
        }
    };

    return (
        <div className="p-6 bg-gray-900">
            <h1 className="text-2xl font-bold text-white tracking-wider mb-6">Add Exited Call</h1>
            <Card className="bg-gray-800 shadow-none border-none">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="ticker" className="text-sm font-medium text-gray-400">
                                Ticker
                            </label>
                            <input
                                type="text"
                                id="ticker"
                                name="ticker"
                                value={formData.ticker}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white mt-2 rounded-lg border-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="recommendedPrice" className="text-sm font-medium text-gray-400">
                                Recommended Price
                            </label>
                            <input
                                type="text"
                                id="recommendedPrice"
                                name="recommendedPrice"
                                value={formData.recommendedPrice}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white mt-2 rounded-lg border-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="returnPercentage" className="text-sm font-medium text-gray-400">
                                Return Percentage
                            </label>
                            <input
                                type="text"
                                id="returnPercentage"
                                name="returnPercentage"
                                value={formData.returnPercentage}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white mt-2 rounded-lg border-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="duration" className="text-sm font-medium text-gray-400">
                                Duration (in days)
                            </label>
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white mt-2 rounded-lg border-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="dateOfRecommendation" className="text-sm font-medium text-gray-400">
                                Date of Recommendation
                            </label>
                            <DatePicker
                                selected={formData.dateOfRecommendation}
                                onChange={(date) => handleDateChange(date, "dateOfRecommendation")}
                                dateFormat="yyyy-MM-dd"
                                className="w-full p-2 bg-gray-700 text-white mt-2 ml-2 rounded-lg border-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="sellPrice" className="text-sm font-medium text-gray-400">
                                Sell Price
                            </label>
                            <input
                                type="text"
                                id="sellPrice"
                                name="sellPrice"
                                value={formData.sellPrice}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white mt-2 rounded-lg border-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="sellDate" className="text-sm font-medium text-gray-400">
                                Sell Date
                            </label>
                            <DatePicker
                                selected={formData.sellDate}
                                onChange={(date) => handleDateChange(date, "sellDate")}
                                dateFormat="yyyy-MM-dd"
                                className="w-full p-2 bg-gray-700 text-white mt-2 ml-2 rounded-lg border-none"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="annualReturns" className="text-sm font-medium text-gray-400">
                                Annual Returns
                            </label>
                            <input
                                type="text"
                                id="annualReturns"
                                name="annualReturns"
                                value={formData.annualReturns}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 text-white mt-2 rounded-lg border-none"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white mt-6 rounded-lg border-none"
                            disabled={isSubmitting} // Disable the button while submitting
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mt-4 text-green-500 font-semibold">
                            {successMessage}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AddExitedCall;
