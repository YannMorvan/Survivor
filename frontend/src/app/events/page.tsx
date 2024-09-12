"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Calendar from '../components/calendar';
import Modal from '../components/modal';

interface Events {
    id: number;
    name: string;
    date: string;
    duration: number;
    location_name: string;
    location_x: number;
    location_y: number;
}

export default function Events() {
    const [selectedMonth, setSelectedMonth] = useState('July 2024');
    const [selectedWeek, setSelectedWeek] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Events>();
    const [view, setView] = useState<'mois' | 'semaine' | 'jour'>('mois');
    const [listView, setListView] = useState<boolean>(false);

    useEffect(() => {
        if (view === 'mois') {
            const [monthName, year] = selectedMonth.split(' ');
            const monthIndex = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
            const yearNumber = parseInt(year, 10);
            const firstDayOfMonth = new Date(yearNumber, monthIndex, 1);
            const firstWeekStart = getWeekStartDate(firstDayOfMonth);
            setSelectedWeek(firstWeekStart);
            setSelectedDay(firstDayOfMonth);
        } else if (view === 'semaine') {
            const monthName = selectedWeek.toLocaleString('default', { month: 'long' });
            const year = selectedWeek.getFullYear();
            setSelectedMonth(`${monthName} ${year}`);
        } else if (view === 'jour') {
            setSelectedMonth(selectedDay.toLocaleString('default', { month: 'long', year: 'numeric' }));
        }
    }, [view]);

    const changeDate = (direction: string) => {
        if (view === 'semaine') {
            const currentDate = new Date(selectedWeek);
            currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
            setSelectedWeek(currentDate);

            const newMonthName = currentDate.toLocaleString('default', { month: 'long' });
            const newYear = currentDate.getFullYear();
            setSelectedMonth(`${newMonthName} ${newYear}`);
        } else if (view === 'mois') {
            const [currentMonthName, currentYear] = selectedMonth.split(' ');
            const currentMonthIndex = new Date(Date.parse(currentMonthName + " 1, " + currentYear)).getMonth();
            const currentYearNumber = parseInt(currentYear, 10);

            const currentDate = new Date(currentYearNumber, currentMonthIndex);

            currentDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));

            const newMonthName = currentDate.toLocaleString('default', { month: 'long' });
            const newYear = currentDate.getFullYear();

            setSelectedMonth(`${newMonthName} ${newYear}`);
        } else if (view === 'jour') {
            const currentDate = new Date(selectedDay);
            currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
            setSelectedDay(currentDate);
            setSelectedMonth(currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
        }
    };

    const handleEventClick = (event: Events) => {
        setSelectedEvent(event);
    };

    const getMapUrl = (event: Events) => {
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
                            <p className='ml-10 mt-5 text-xl font-semibold'>
                                {view === 'semaine' 
                                    ? `Week of ${selectedWeek.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}` 
                                    : view === 'jour'
                                    ? `Day of ${selectedDay.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`
                                    : selectedMonth}
                            </p>
                            <div id='next'>
                                <ChevronLeft size={22} className='text-slate-400 cursor-pointer ml-5 mt-6' onClick={() => changeDate('prev')} />
                            </div>     
                            <div id='prev'>  
                                <ChevronRight size={22} className='text-slate-400 cursor-pointer ml-5 mt-6' onClick={() => changeDate('next')} />
                            </div>         
                        </div>
                        <div className='flex mt-5 md:ml-0 ml-10'>
                            <div className='mr-5 flex border rounded overflow-hidden'>
                                <p className={`text-xs font-semibold text-slate-400 border px-4 py-2 cursor-pointer`}
                                    onClick={() => {
                                        setView('jour');
                                        setSelectedDay(new Date());
                                    }}>
                                    Aujourd'hui
                                </p>
                            </div>
                            <div className='mr-10 flex border rounded overflow-hidden'>
                                <p
                                    className={`text-xs font-semibold border px-4 py-2 cursor-pointer ${
                                        view === 'mois' ? 'bg-slate-100' : ''
                                    }`}
                                    onClick={() => setView('mois')}
                                >
                                    Mois
                                </p>
                                <p
                                    className={`text-xs font-semibold border px-4 py-2 cursor-pointer ${
                                        view === 'semaine' ? 'bg-slate-100' : ''
                                    }`}
                                    onClick={() => setView('semaine')}
                                >
                                    Semaine
                                </p>
                                <p
                                    className={`text-xs font-semibold border px-4 py-2 cursor-pointer ${
                                        view === 'jour' ? 'bg-slate-100' : ''
                                    }`}
                                    onClick={() => setView('jour')}
                                >
                                    Jour
                                </p>
                                <p
                                    className={`text-xs font-semibold border px-4 py-2 cursor-pointer ${
                                        listView === true ? 'bg-slate-100' : ''
                                    }`}
                                    onClick={() => setListView(!listView)}
                                >
                                    Liste
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Calendar month={selectedMonth} week={selectedWeek} day={selectedDay} list={listView} view={view} onEventClick={handleEventClick} />
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

const getWeekStartDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek;
    return new Date(date.setDate(diff));
};
