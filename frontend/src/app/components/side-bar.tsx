"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, SquareUser, UserCheck, ChartLine, SmilePlus, CalendarCog, Settings } from "lucide-react";

const Sidebar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setDarkMode(isDarkMode);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode((prevDarkMode) => {
            const newDarkMode = !prevDarkMode;
            if (newDarkMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("darkMode", "true");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("darkMode", "false");
            }

            window.location.reload();
            return newDarkMode;
        });
    };

    const handleMouseEnter = () => {
        setIsSidebarExpanded(true);
    };

    const handleMouseLeave = () => {
        setIsSidebarExpanded(false);
    };

    return (
        <div className="bg-white dark:bg-slate-900">
            <aside
                id="sidebar"
                className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
                    isSidebarExpanded ? "w-64" : "w-20"
                }`}
                aria-label="Sidebar"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex h-full flex-col justify-between overflow-y-auto border-r border-slate-200 overflow-hidden dark:border-slate-700 bg-white px-3 py-4 dark:bg-slate-900">
                    <div>
                        <div className="ml-3 mb-10">
                            <div className="flex justify-center">
                                {isSidebarExpanded && <p className="text-xl">Survivor</p>}
                            </div>
                        </div>

                        <div className="hover:bg-slate-100 cursor-pointer mt-10 dark:hover:bg-slate-700 w-11/12 mb-1 flex items-center rounded-lg ml-2 p-4 text-slate-900 dark:text-white">
                            <SquareUser size={24} />
                            {isSidebarExpanded && <p className="ml-3">Dashboard</p>}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 mb-4"></div>

                        <div className="hover:bg-slate-100 cursor-pointer dark:hover:bg-slate-700 w-11/12 mb-1 flex items-center rounded-lg ml-2 p-4 text-slate-900 dark:text-white">
                            <SquareUser size={24} />
                            {isSidebarExpanded && <p className="ml-3">Account Management</p>}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 mb-4"></div>

                        <div className="hover:bg-slate-100 cursor-pointer dark:hover:bg-slate-700 w-11/12 mb-1 flex items-center rounded-lg ml-2 p-4 text-slate-900 dark:text-white">
                            <UserCheck size={24} />
                            {isSidebarExpanded && <p className="ml-3">Client Profile</p>}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 mb-4"></div>

                        <div className="hover:bg-slate-100 cursor-pointer dark:hover:bg-slate-700 w-11/12 mb-1 flex items-center rounded-lg ml-2 p-4 text-slate-900 dark:text-white">
                            <ChartLine size={24} />
                            {isSidebarExpanded && <p className="ml-3">Statistics</p>}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 mb-4"></div>

                        <div className="hover:bg-slate-100 cursor-pointer dark:hover:bg-slate-700 w-11/12 mb-1 flex items-center rounded-lg ml-2 p-4 text-slate-900 dark:text-white">
                            <SmilePlus size={24} />
                            {isSidebarExpanded && <p className="ml-3">Advice</p>}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 mb-4"></div>

                        <div className="hover:bg-slate-100 cursor-pointer dark:hover:bg-slate-700 w-11/12 mb-1 flex items-center rounded-lg ml-2 p-4 text-slate-900 dark:text-white">
                            <CalendarCog size={24} />
                            {isSidebarExpanded && <p className="ml-3">Events</p>}
                        </div>
                    </div>

                    <div 
                        className="hover:bg-slate-100 cursor-pointer dark:hover:bg-slate-700 mb-4 w-11/12 flex items-center rounded-lg ml-2 p-4 text-slate-900 dark:text-white"
                        onClick={toggleDarkMode}
                    >
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                        {isSidebarExpanded && <p className="ml-3">{darkMode ? "Light Mode" : "Dark Mode"}</p>}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
