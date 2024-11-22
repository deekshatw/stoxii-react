import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, IndianRupeeIcon, BarChart2, Layers } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const StockDetailsModal = ({ open, onClose, stockSymbol }) => {
    const [loading, setLoading] = useState(false);
    const [stockDetails, setStockDetails] = useState(null);
    const [historicData, setHistoricData] = useState(null);

    useEffect(() => {
        if (open && stockSymbol) {
            setLoading(true);

            const fetchStockData = async () => {
                try {
                    const response = await fetch(`https://stoxii-backend.vercel.app/api/v1/stocks/detail?symbol=${stockSymbol}`);
                    const data = await response.json();
                    setStockDetails(data?.stockData.companyDetail);
                    setHistoricData(data?.stockData.historicalData);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching stock details or historic data:', err);
                    setLoading(false);
                }
            };

            fetchStockData();
        }
    }, [open, stockSymbol]);

    const formatLargeNumber = (num) => {
        if (!num) return 'N/A';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    };

    const prepareChartData = () => {
        if (!historicData) return [];
        return historicData.map(item => ({
            date: format(new Date(item.date), 'MMM dd'),
            price: item.close
        }));
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-2 shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-primary">₹{payload[0].value.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <Card className="bg-card border border-border shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6 flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted-foreground/10 mb-4">
                    <Icon className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
                <p className="text-3xl font-bold text-primary mb-1">₹{value}</p>
                {trend !== undefined && (
                    <div
                        className={`flex items-center justify-center text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'
                            }`}
                    >
                        {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="ml-1">{Math.abs(trend).toFixed(2)}%</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[872px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {loading ? <Skeleton className="h-8 w-48" /> : stockDetails?.shortName}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-[200px] w-full" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-24" />
                            <Skeleton className="h-24" />
                            <Skeleton className="h-24" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <StatCard
                                title="Current Price"
                                value={formatLargeNumber(stockDetails?.regularMarketPrice)}
                                icon={IndianRupeeIcon}
                                trend={stockDetails?.regularMarketChangePercent}
                            />
                            <StatCard
                                title="Market Cap"
                                value={formatLargeNumber(stockDetails?.marketCap)}
                                icon={BarChart2}
                            />
                            <StatCard
                                title="Volume"
                                value={formatLargeNumber(stockDetails?.regularMarketVolume)}
                                icon={Layers}
                            />
                        </div>

                        <Card className="bg-card p-4">
                            <h3 className="text-lg font-semibold mb-4">Price History</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={prepareChartData()} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                                        <XAxis
                                            dataKey="date"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `₹${value}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <div className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">52 Week Low</p>
                                    <p className="text-lg font-semibold">₹{stockDetails?.fiftyTwoWeekLow || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">52 Week High</p>
                                    <p className="text-lg font-semibold">₹{stockDetails?.fiftyTwoWeekHigh || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default StockDetailsModal;