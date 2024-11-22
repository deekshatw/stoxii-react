import React from "react";
import { Link } from "react-router-dom";

const SidebarLink = ({ to, icon: Icon, label }) => {
    return (
        <li>
            <Link
                to={to}
                className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors no-underline"
            >
                <Icon className="w-5 h-5 mr-3" />
                {label}
            </Link>
        </li>
    );
};

export default SidebarLink;
