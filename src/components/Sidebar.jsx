import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    History,
    Settings,
    LogOut,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import logo from "../../public/images/main_logo.png";

const Sidebar = ({ handleLogout }) => {
    const location = useLocation();

    const menuItems = [
        {
            path: '/',
            name: 'Dashboard',
            icon: <LayoutDashboard className="w-4 h-4 mr-2" />
        },
        {
            path: '/users',
            name: 'Users',
            icon: <Users className="w-4 h-4 mr-2" />
        },
        {
            path: '/past-performance',
            name: 'Past Performance',
            icon: <History className="w-4 h-4 mr-2" />
        },
        {
            path: '/settings',
            name: 'Settings',
            icon: <Settings className="w-4 h-4 mr-2" />
        }
    ];

    // Get user data from localStorage
    const userDataString = localStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const userName = userData?.firstName || 'User Name';
    const userEmail = userData?.email || 'user@example.com';

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="h-full flex flex-col bg-gray-950 text-gray-100">
            {/* Logo */}
            <div className="p-6 flex justify-center">
                <img
                    src={logo}
                    alt="Stoxii"
                    className="h-8 w-auto"
                />
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center py-3 px-3 my-2 text-sm rounded-md transition-colors no-underline",
                                    "hover:bg-gray-800 hover:text-gray-100",
                                    isActive
                                        ? "bg-gray-800 text-gray-100"
                                        : "text-gray-400"
                                )
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* <Separator className="bg-gray-800" /> */}

            {/* User Profile Section - Moved to bottom */}
            <div className="p-6">
                <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gray-800 text-gray-100">
                                {getInitials(userName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-sm font-semibold text-gray-100">{userName}</h2>
                            <p className="text-xs text-gray-400">{userEmail}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Separator className="bg-gray-800" /> */}

            {/* Logout Button */}
            <div className="p-4">
                <Button
                    variant="outline"
                    className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-gray-800 border-gray-800"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;