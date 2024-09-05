"use client";

import React, { useState, useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Calendar from '../components/calendar';

export default function Events() {
    return (
        <div className="ml-6 sm:mr-6 mr-6 mb-5">
            <div className='flex justify-between'>
                <div className=''>
                    <h1 className='md:text-3xl sm:text-2xl text-xl font-semibold'>Events</h1>
                </div>
                <button 
                    type="button"
                    id="reports button"
                    aria-label='Reports button'
                    className="xs:ml-5 xs:mt-0 mt-2 text-slate-900 bg-sky-700 font-medium border border-slate-200 rounded-sm text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <div className='flex'>
                        <Plus size={16} color='white' className='mr-3 mt-0.5'/>
                        <p className='text-white'>Add Event</p>
                    </div>
                </button>
            </div>
            <div className='mt-5 border border-slate-300 bg-white'>
                <div>
                    <div className='flex justify-between'>
                        <div className='flex'>
                            <p className='ml-10 mt-5 text-xl font-semibold'>July 2024</p>
                            <ChevronLeft size={22} className='text-slate-400 cursor-pointer ml-5 mt-6'/>
                            <ChevronRight size={22} className='text-slate-400 cursor-pointer ml-5 mt-6'/>
                        </div>
                        <div className='flex mt-5'>
                            <div>
                                <div className='mr-5 flex border rounded overflow-hidden'>
                                    <p className={`text-xs text-slate-400 border px-4 py-2 cursor-pointer`}>
                                        Today
                                    </p>
                                </div>
                            </div>
                            <div className='mr-10 flex border rounded overflow-hidden'>
                                <p className={`text-xs border px-4 py-2 cursor-pointer bg-slate-100`}>
                                    Month
                                </p>
                                <p className={`text-xs border px-4 py-2 cursor-pointer`}>
                                    Week
                                </p>
                                <p className={`text-xs border px-4 py-2 cursor-pointer`}>
                                    Day
                                </p>
                                <p className={`text-xs border px-4 py-2 cursor-pointer`}>
                                    List
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Calendar />
            </div>
            <div className='mt-10 border bg-white p-5'>
            <div className='w-full'>
                <iframe
                width="100%"
                height="600"
                scrolling="no"
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Boston,%20UK+(My%20Business%20Name)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                title="Google Maps"
                />
            </div>
            </div>
        </div>
    );
}