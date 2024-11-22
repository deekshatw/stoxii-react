import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import SidebarLink from "./SideBarLink";
import logo from "../../public/images/main_logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UserIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ClockIcon from "@mui/icons-material/AccessTime";
import Avatar from "../../public/images/avatar.png";
import { MyContext } from "../App";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Access handleLogout from context
    const { handleLogout } = useContext(MyContext);

    // Get the user data from local storage (assuming the user data is stored under the key 'user')
    const user = JSON.parse(localStorage.getItem("user"));

    // Toggle the sidebar open and closed
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Hamburger Menu Icon */}
            <button
                className="fixed top-4 left-4 z-[110] p-2 bg-gray-800 text-white rounded-md md:hidden"
                onClick={toggleSidebar}
            >
                {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Sidebar with Static Background Color */}
            <div
                className={`fixed top-0 left-0 z-[100] w-[80%] sm:w-[60%] md:w-[20%] h-screen shadow-lg bg-gray-800 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 flex flex-col justify-between`}
            >
                <div>
                    <Link to="/">
                        <div className="logoWrapper py-6 flex justify-center">
                            <img src={logo} alt="Logo" className="w-32 md:w-32" />
                        </div>
                    </Link>

                    <nav className="mt-8">
                        <ul className="space-y-2 px-4">
                            <SidebarLink to="/" icon={DashboardIcon} label="Dashboard" />
                            <SidebarLink to="/users" icon={UserIcon} label="Users" />
                            <SidebarLink to="/past-performance" icon={ClockIcon} label="Past Performance" />
                            {/* <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" /> */}
                        </ul>
                    </nav>
                </div>

                {/* Profile Component at the Bottom, Horizontally Centered */}
                <div
                    className="flex flex-col items-center mx-auto w-[90%] px-6 py-4 md:mt-auto mt-6 bg-gray-700 rounded-xl mb-3"
                    style={{ marginTop: "auto" }}
                >
                    {/* Avatar and Name */}
                    <div className="w-full flex items-center justify-start h-16">
                        <img
                            alt="User Avatar"
                            src={Avatar}
                            className="mr-2 w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            {/* Display user name and email from local storage */}
                            <span className="text-white font-semibold">
                                {user ? user.firstName : "John Doe"}
                            </span>
                            <span className="text-white text-sm">
                                {user ? user.email : "email@example.com"}
                            </span>
                        </div>
                    </div>

                    {/* Logout Button with Padding and Background Color */}
                    <button
                        className="logout-btn"
                        onClick={handleLogout} // Call handleLogout on click
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Overlay for mobile view */}
            {isOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[90] md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
