"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Calendar from '../components/calendar';
import Modal from '../components/modal';

export default function Events() {

    const [selectedMonth, setSelectedMonth] = useState('July 2024');
    const [selectedEvent, setSelectedEvent] = useState(null);

    const changeMonth = (direction: string) => {
        const [currentMonthName, currentYear] = selectedMonth.split(' ');
        const currentMonthIndex = new Date(Date.parse(currentMonthName + " 1, " + currentYear)).getMonth();
        const currentYearNumber = parseInt(currentYear, 10);

        const currentDate = new Date(currentYearNumber, currentMonthIndex);

        currentDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));

        const newMonthName = currentDate.toLocaleString('default', { month: 'long' });
        const newYear = currentDate.getFullYear();
        
        setSelectedMonth(`${newMonthName} ${newYear}`);
    };

    const handleEventClick = (event) => {
        console.log('Event clicked:', event);
        setSelectedEvent(event);
    };

    const getMapUrl = (event) => {
        if (!event) return '';

        const { location_x, location_y, location_name } = event;

        return `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${location_x},${location_y}(${location_name})&t=&z=13&ie=UTF8&iwloc=B&output=embed`;
    };


    return (
        <div className="ml-6 sm:mr-6 mr-6 mb-5">
            <div className='flex justify-between'>
                <div className=''>
                    <h1 className='md:text-3xl sm:text-2xl text-xl font-semibold'>Events</h1>
                </div>
                <Modal />
            </div>
            <div className='mt-5 border border-slate-300 bg-white'>
                <div>
                    <div className='md:flex justify-between'>
                        <div className='flex'>
                            <p className='ml-10 mt-5 text-xl font-semibold'>{selectedMonth}</p>
                            <ChevronLeft size={22} className='text-slate-400 cursor-pointer ml-5 mt-6' onClick={() => changeMonth('prev')} />
                            <ChevronRight size={22} className='text-slate-400 cursor-pointer ml-5 mt-6' onClick={() => changeMonth('next')} />
                        </div>
                        <div className='flex mt-5 md:ml-0 ml-10'>
                            <div>
                                <div className='mr-5 flex border rounded overflow-hidden'>
                                    <p className={`text-xs font-semibold text-slate-400 border px-4 py-2 cursor-pointer`}>
                                        Aujourd'hui
                                    </p>
                                </div>
                            </div>
                            <div className='mr-10 flex border rounded overflow-hidden'>
                                <p className={`text-xs font-semibold border px-4 py-2 cursor-pointer bg-slate-100`}>
                                    Mois
                                </p>
                                <p className={`text-xs font-semibold border px-4 py-2 cursor-pointer`}>
                                    Semaine
                                </p>
                                <p className={`text-xs font-semibold border px-4 py-2 cursor-pointer`}>
                                    Jour
                                </p>
                                <p className={`text-xs font-semibold border px-4 py-2 cursor-pointer`}>
                                    Liste
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Calendar month={selectedMonth} onEventClick={handleEventClick} />
            </div>
            <div className='mt-10 border bg-white p-5'>
                <div className='w-full'>
                    <iframe
                        width="100%"
                        height="600"
                        scrolling="no"
                        src={selectedEvent ? getMapUrl(selectedEvent) : ''}
                        title="Google Maps"
                    />
                </div>
            </div>
        </div>
    );
}
