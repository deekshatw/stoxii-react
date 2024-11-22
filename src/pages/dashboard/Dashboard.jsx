import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import StockDetailsModal from '../../components/StockDetailsModel';

const Dashboard = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await fetch('https://stoxii-backend.vercel.app/api/v1/stocks/stocks-list');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data?.data) {
                    setStocks(data.data);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch stocks');
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStockClick = (symbol) => {
        setSelectedStockSymbol(symbol);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedStockSymbol(null);
    };

    const filteredStocks = stocks.filter((stock) =>
        stock?.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock?.longName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate dashboard statistics
    const calculateStockStatistics = () => {
        const totalStocks = stocks.length;
        const upStocks = stocks.filter(stock =>
            stock?.regularMarketChangePercent && stock.regularMarketChangePercent > 0
        ).length;
        const downStocks = stocks.filter(stock =>
            stock?.regularMarketChangePercent && stock.regularMarketChangePercent < 0
        ).length;
        const neutralStocks = totalStocks - upStocks - downStocks;

        return {
            totalStocks,
            upStocks,
            downStocks,
            neutralStocks
        };
    };

    const { totalStocks, upStocks, downStocks, neutralStocks } = calculateStockStatistics();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center">
                <div className="w-full max-w-4xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="h-48 w-full bg-gray-700 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    const renderPriceChangeIndicator = (changePercent) => {
        if (changePercent > 0) return <TrendingUp className="text-green-500" />;
        if (changePercent < 0) return <TrendingDown className="text-red-500" />;
        return <ArrowRight className="text-gray-400" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Heading at the Top */}
                <h1 className="text-2xl font-bold text-white tracking-wider mb-10">
                    Stock Dashboard
                </h1>
                {/* Dashboard Statistics with Enhanced Styling */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-blue-900/20 hover:scale-105 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm uppercase tracking-wider">Total Stocks</span>
                            <span className="text-3xl font-bold text-blue-400">{totalStocks}</span>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-green-900/20 hover:scale-105 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm uppercase tracking-wider">Up</span>
                            <div className="flex items-center">
                                <ChevronUp className="text-green-500 mr-2 w-6 h-6" />
                                <span className="text-3xl font-bold text-green-500">{upStocks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-red-900/20 hover:scale-105 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm uppercase tracking-wider">Down</span>
                            <div className="flex items-center">
                                <ChevronDown className="text-red-500 mr-2 w-6 h-6" />
                                <span className="text-3xl font-bold text-red-500">{downStocks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-gray-900/20 hover:scale-105 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm uppercase tracking-wider">Neutral</span>
                            <span className="text-3xl font-bold text-gray-400">{neutralStocks}</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar Just Above the Grid */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search stocks..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                        />
                    </div>
                </div>

                {/* Stock Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStocks.map((stock) => (
                        <div
                            key={stock?.symbol}
                            className="bg-gray-800 p-6 rounded-lg shadow-2xl hover:scale-105 transition-all cursor-pointer group border-2 border-gray-700 hover:border-[#487FD9]"
                            onClick={() => handleStockClick(stock?.symbol)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors capitalize">
                                        {stock?.shortName || "N/A"}
                                    </h2>
                                    <p className="text-sm text-gray-400 truncate max-w-[200px]">
                                        {stock?.longName || "N/A"}
                                    </p>
                                </div>
                                {renderPriceChangeIndicator(stock?.regularMarketChangePercent)}
                            </div>
                            <div className="flex items-baseline justify-between">
                                <div className="flex items-baseline">
                                    <span className="text-xl font-semibold text-gray-300">₹</span>
                                    <span className="text-2xl font-bold ml-1 text-white">
                                        {stock?.regularMarketPrice?.toFixed(2) || "N/A"}
                                    </span>
                                </div>
                                <p className={`text-sm font-medium ${stock?.regularMarketChangePercent > 0
                                    ? 'text-green-500'
                                    : stock?.regularMarketChangePercent < 0
                                        ? 'text-red-500'
                                        : 'text-gray-400'
                                    }`}>
                                    {stock?.regularMarketChangePercent
                                        ? `${stock?.regularMarketChangePercent.toFixed(2)}%`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <StockDetailsModal
                open={modalOpen}
                onClose={handleCloseModal}
                stockSymbol={selectedStockSymbol}
            />
        </div>
    );
};

export default Dashboard;