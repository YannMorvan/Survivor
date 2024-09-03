"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquareMore, User, UserRound, Menu } from 'lucide-react'

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('English (US)');
  const [activeRoute, setActiveRoute] = useState('Dashboard');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange: (newLanguage: string) => void = (newLanguage: string) => {
    setLanguage(newLanguage);
    setIsDropdownOpen(false);
  };

  const handleRouteChange: (route: string) => void = (route: string) => {
    setActiveRoute(route);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen p-4 flex items-center justify-between">
        <a className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Soul Connection</span>
        </a>
        <div className="flex items-center jusitfy-end md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse">
        <div className='md:block hidden'>
            <MessageSquareMore className='text-sky-700 cursor-pointer mt-0.5 mr-3'/>
        </div>
        <div className='md:block hidden'>
          <button
            type="button"
            onClick={toggleDropdown}
            className="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg className="w-5 h-5 rounded-full me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3900 3900">
              <path fill="#b22234" d="M0 0h7410v3900H0z" />
              <path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff" strokeWidth="300" />
              <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
              <g fill="#fff">
                <g id="d">
                  <g id="c">
                    <g id="e">
                      <g id="b">
                        <path id="a" d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z" />
                        <use xlinkHref="#a" y="420" />
                        <use xlinkHref="#a" y="840" />
                        <use xlinkHref="#a" y="1260" />
                      </g>
                      <use xlinkHref="#a" y="1680" />
                    </g>
                    <use xlinkHref="#b" x="247" y="210" />
                  </g>
                  <use xlinkHref="#c" x="494" />
                </g>
                <use xlinkHref="#d" x="988" />
                <use xlinkHref="#c" x="1976" />
                <use xlinkHref="#e" x="2470" />
              </g>
            </svg>
          </button>
          <div>
          </div>
          </div>
          <div className='border rounded-full p-2 bg-sky-600 md:block hidden'>
            <UserRound size={16} color='white'/>
          </div>
          <div className="relative inline-block text-left">
      <button
        id="dropdownDefaultButton"
        type="button"
        onClick={toggleDropdown}
        className="md:hidden block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <Menu />
      </button>
        <div
            id="dropdown"
            className={`z-10 ${isDropdownOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute right-0 mt-2`}
        >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
            </li>
            <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Customers</a>
            </li>
            <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Tips</a>
            </li>
            <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Events</a>
            </li>
            <div className='border'></div>
            <li>
                <div className='flex hover:bg-gray-100'>
                    <MessageSquareMore className='text-sky-700 cursor-pointer mt-1.5 ml-3'/>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Chat</a>
                </div>
            </li>
            <li>
                <div className='flex hover:bg-gray-100'>
                    <div className='border rounded-full p-2 ml-2 bg-sky-600'>
                        <UserRound size={12} color='white'/>
                    </div>
                    <a href="#" className="block py-1 pl-3.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</a>
                </div>
            </li>
            </ul>
        </div>
        </div>
        </div>
        <div className={`w-full lg:flex lg:w-auto ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="font-medium md:static absolute flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 dark:border-gray-700">
            {['Dashboard', 'Coaches', 'Customers', 'Tips', 'Events'].map(route => (
              <li className="relative inline-block" key={route}>
                <a
                  href={`#${route.toLowerCase()}`}
                  onClick={() => handleRouteChange(route)}
                  className={`block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:p-0 md:dark:dark-blue-500 inline-block relative
                      ${activeRoute === route ? 'text-sky-700' : 'md:text-slate-700'
                      }`}
                >
                  {route}
                  {activeRoute === route && (
                    <div className='absolute mt-5 w-full border-b-4 rounded-xl border-sky-600'></div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
