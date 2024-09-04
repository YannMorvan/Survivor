"use client";
import React, { useState, useEffect } from 'react';
import { CalendarDays, ChevronRight, ChevronDown, ClipboardPlus, ArrowUp, ArrowDown } from 'lucide-react';
import CustomersOverView from '../components/charts/customers-overview';

export default function Dashboard() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [lastDays, setLastDays] = useState("Last 30 days");
    const [selectedPeriod, setSelectedPeriod] = useState('7J');


    const handlePeriodClick: (period: string) => void = (period: string) => {
        setSelectedPeriod(period);
    };
    
    const getButtonStyle: (period: string) => string = (period: string) => {
        return selectedPeriod === period
          ? 'text-black bg-slate-100'
          : 'text-slate-500 bg-white';
      };

    const toggleDropdown: () => void = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        setLastDays(lastDays);
    }, [lastDays]);

    return (
        <div className="ml-6 sm:mr-6 mr-6">
            <div className='md:flex md:justify-between'>
                <div>
                    <h1 className='md:text-3xl sm:text-2xl text-xl font-bold'>Dashboard</h1>
                    <h2 className='mt-4 text-sm text-slate-500'>Welcome!</h2>
                </div>
                <div className='mt-5'>
                    <button
                        id="dropdownDefaultButton"
                        type="button"
                        onClick={toggleDropdown}
                        className="text-slate-900 bg-white font-medium border border-slate-200 rounded-sm text-sm px-5 py-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >   
                        <div className='flex justify-end'>
                            <CalendarDays size={16} className='mr-3 mt-0.5'/>
                            <p>{lastDays}</p>
                            {isDropdownOpen ? <ChevronDown size={16} className='ml-3 mt-0.5'/> : <ChevronRight size={16} className='ml-3 mt-0.5'/>}
                        </div>
                    </button>
                <div
            id="dropdown"
                className={`z-10 ${isDropdownOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2`}
            >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <p onClick={() => setLastDays('Last 30 days')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</p>
                    </li>
                    <li>
                        <p onClick={() => setLastDays('Last 10 days')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 10 days</p>
                    </li>
                    <li>
                        <p onClick={() => setLastDays('Last 5 days')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 5 days</p>
                    </li>
                    <li>
                        <p onClick={() => setLastDays('Last 1 day')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 1 day</p>
                    </li>
                    </ul>
                </div>
                <button className="xs:ml-5 xs:mt-0 mt-2 text-slate-900 bg-sky-700 font-medium border border-slate-200 rounded-sm text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <div className='flex'>
                        <ClipboardPlus size={16} color='white' className='mr-3 mt-0.5'/>
                        <p className='text-white'>Reports</p>
                    </div>
                </button>
                </div>
            </div>
            <div className='lg:flex'>
                <div className='bg-white rounded-sm p-5 mt-5 lg:w-7/12 border lg:mr-7'>
                    <div>
                        <div>
                            <div className='flex xs:justify-between'>
                                <div>
                                    <p className='font-medium md:text-md text-sm md:mr-0 mr-2'>Aperçu des clients</p>
                                </div>
                                <div className='flex border rounded overflow-hidden'>
                                    <p
                                        className={`text-xs border px-2 py-1 cursor-pointer ${getButtonStyle('7J')}`}
                                        onClick={() => handlePeriodClick('7J')}
                                    >
                                        7 J
                                    </p>
                                    <p
                                        className={`text-xs border px-2 py-1 cursor-pointer ${getButtonStyle('1M')}`}
                                        onClick={() => handlePeriodClick('1M')}
                                    >
                                        1 M
                                    </p>
                                    <p
                                        className={`text-xs border px-2 py-1 cursor-pointer ${getButtonStyle('3M')}`}
                                        onClick={() => handlePeriodClick('3M')}
                                    >
                                        3 M
                                    </p>
                                    </div>
                            </div>
                            <p className='text-slate-500 text-sm'>Quelle période les clients ont rejoints</p>
                        </div>
                    </div>
                    <div className='mt-7 flex justify-between lg:w-8/12'>
                        <div className='md:text-left text-center'>
                            <p className='text-slate-500 text-sm'>Clients</p>
                            <p className='mt-1 text-slate-900 text-xl'>932</p>
                            <div className='flex md:justify-normal justify-center'>
                                <ArrowUp size={12} className='text-green-400 mt-1.5'/>
                                <p className='mt-1 text-xs text-green-400'>12.37%</p>
                            </div>
                        </div>
                        <div className='md:text-left text-center'>
                            <p className='text-slate-500 text-sm'>Faire des réunions</p>
                            <p className='mt-1 text-slate-900 text-xl'>28.49%</p>
                            <div className='flex md:justify-normal justify-center'>
                                <ArrowDown size={12} className='text-red-400 mt-1.5'/>
                                <p className='mt-1 text-xs text-red-400'>12.37%</p>
                            </div>
                        </div>
                        <div className='md:text-left text-center'>
                            <p className='text-slate-500 text-sm'>Clients par coach</p>
                            <p className='mt-1 text-slate-900 text-xl'>34</p>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <CustomersOverView />
                    </div>
                </div>
                <div className='bg-white rounded-sm p-5 mt-5 lg:w-5/12 border'>
                    <p>Customers Overview</p>
                </div>
            </div>
        </div>
    );
}