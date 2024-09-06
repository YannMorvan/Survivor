"use client";
import React, { useState, useEffect, use } from 'react';
import { CalendarDays, ChevronRight, ChevronDown, ClipboardPlus, ArrowUp, ArrowDown } from 'lucide-react';
import CustomersOverView from '../components/charts/customers-overview';
import ChartEvents from '../components/charts/events';
import ChartMap from '../components/charts/map';
import { sendPostRequest } from '../utils/utils';
import ChartMeetings from '../components/charts/meetings';
import { set } from 'date-fns';

interface Event {
    date: string,
    id: number,
    duration: number,
    id_employee: number,
    location_name: string,
    location_x: number,
    location_y: number,
    max_participants: number,
    name: string,
    type: string,
}

interface Encounters {
    encounters: string,
}

interface Address {
    address: string,
}

interface Data {
    data: Event[],
    encounters: Encounters[],
    address: Address[],
}

const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfWeek = firstDayOfYear.getDay() || 7;
    const diff = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((diff + dayOfWeek) / 7);
};

export default function Dashboard() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mapIsDropdownOpen, setMapIsDropdownOpen] = useState(false);
    const [lastDays, setLastDays] = useState("30 derniers jours");
    const [selectedPeriod, setSelectedPeriod] = useState('7J');
    const [selectedMapPeriod, setSelectedMapPeriod] = useState("30 jours");
    const [isMeetingsDropdownOpen, setIsMeetingsDropdownOpen] = useState(false);
    const [selectedMeetingsPeriod, setSelectedMeetingsPeriod] = useState("30 jours");
    const [events, setEvents] = useState<Event[]>([]);
    const [meetings, setMeetings] = useState<Encounters[]>([]);
    const [augustEvents, setAugustEvents] = useState<Event[]>([]);
    const [weeklyEvents, setWeeklyEvents] = useState<Event[]>([]);
    const [dailyAverage, setDailyAverage] = useState<number>(0);
    const [weeklyAverage, setWeeklyAverage] = useState<number>(0);
    const [progressionPercentage, setProgressionPercentage] = useState<number>(0);
    const [progressionDaily, setProgressionDaily] = useState<number>(0);
    const [progressionWeekly, setProgressionWeekly] = useState<number>(0);
    const [clients, setClients] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await sendPostRequest('http://localhost/statistics.php', {});
                const data = JSON.parse(response);
 
                const events = data.data.events;

                setMeetings(data.data.encounters);
    
                if (!Array.isArray(events)) {
                    throw new Error("La réponse ne contient pas un tableau d'événements");
                }
    
                setEvents(events);
                console.log(events);

                const august = events.filter((event: Event) => {
                    const eventDate = new Date(event.date);
                    if (isNaN(eventDate.getTime())) {
                        console.warn(`Date invalide pour l'événement : ${event.date}`);
                        return false;
                    }
                    return eventDate.getMonth() === 6 && eventDate.getFullYear() === 2024;
                });
                
                let lastAugustDay = august[august.length - 1];

                console.log(lastAugustDay);

                if (lastAugustDay.date != "2024-07-31")
                    lastAugustDay = 0;
                else 
                    lastAugustDay = 1;

                let compareDay = august[august.length - 2];

                if (compareDay.date != "2024-07-31")
                    compareDay = 0;
                else 
                    compareDay = 1;

                const progressionDay = ((lastAugustDay - compareDay) / compareDay) * 100;

                const dailyAvg = august.length / 31;

                const july = events.filter((event: Event) => {
                    const eventDate = new Date(event.date);
                    if (isNaN(eventDate.getTime())) {
                        console.warn(`Date invalide pour l'événement : ${event.date}`);
                        return false;
                    }
                    return eventDate.getMonth() === 5 && eventDate.getFullYear() === 2024;
                });

                const dailyAvgJuly = july.length / 31;

                const progression = july.length > 0 ? ((august.length - july.length) / july.length) * 100 : 0;
    
                setAugustEvents(august);
                setDailyAverage(lastAugustDay);
                setProgressionPercentage(progression);
                setProgressionDaily(progressionDay);
            } catch (error) {
                console.error('Erreur lors de la requête : ', error);
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        const fetchClientsData = async () => {
            try {
              const response = await sendPostRequest(
                `http://localhost/table_clients.php`,
                {}
              );
              
              const data = JSON.parse(response);
              setClients(data.data.length);
            } catch (error) {
              console.error("Erreur lors de la requête : ", error);
            }
          };

          fetchClientsData();
    } , []);
    

    const handlePeriodClick: (period: string) => void = (period: string) => {
        setSelectedPeriod(period);
    };

    const handleMeetingsPeriodClick: (period: string) => void = (period: string) => {
        setSelectedMeetingsPeriod(period);
    }
    
    const getButtonStyle: (period: string) => string = (period: string) => {
        return selectedPeriod === period
          ? 'text-black bg-slate-100'
          : 'text-slate-500 bg-white';
      };

    const toggleMapDropdown: () => void = () => {
        setMapIsDropdownOpen(!mapIsDropdownOpen);
    }

    const toggleDropdown: () => void = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMeetingsDropdown: () => void = () => {
        setIsMeetingsDropdownOpen(!isMeetingsDropdownOpen);
    }

    useEffect(() => {
        setMapIsDropdownOpen(mapIsDropdownOpen);
    }, [mapIsDropdownOpen]);

    useEffect(() => {
        setLastDays(lastDays);
    }, [lastDays]);

    useEffect(() => {
        setSelectedPeriod(selectedMapPeriod);
    }, [selectedMapPeriod]);

    return (
        <div className="ml-6 sm:mr-6 mr-6 mb-5">
            <div className='md:flex md:justify-between'>
                <div>
                    <h1 className='md:text-3xl sm:text-2xl text-xl font-semibold'>Tableau de bord</h1>
                    <h2 className='mt-4 text-sm text-slate-700'>Bienvenue !</h2>
                </div>
                <div className='mt-5'>
                    <button
                        id="Last 30 jours button"
                        aria-label="Last 30 jours button"
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
                        <p onClick={() => setLastDays('30 derniers jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">30 derniers jours</p>
                    </li>
                    <li>
                        <p onClick={() => setLastDays('10 derniers jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">10 derniers jours</p>
                    </li>
                    <li>
                        <p onClick={() => setLastDays('5 derniers jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">5 derniers jours</p>
                    </li>
                    <li>
                        <p onClick={() => setLastDays('dernier jour')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">dernier jour</p>
                    </li>
                    </ul>
                </div>
                <button 
                    type="button"
                    id="reports button"
                    aria-label='Reports button'
                    className="xs:ml-5 xs:mt-0 mt-2 text-slate-900 bg-sky-700 font-medium border border-slate-200 rounded-sm text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <div className='flex'>
                        <ClipboardPlus size={16} color='white' className='mr-3 mt-0.5'/>
                        <p className='text-white'>Rapports</p>
                    </div>
                </button>
                </div>
            </div>
            <div className='lg:flex'>
                <div className='bg-white rounded-sm p-5 mt-5 lg:w-7/12 border lg:mr-7'>
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
                    <div className='mt-7 flex justify-between lg:w-8/12'>
                        <div className='md:text-left text-center'>
                            <p className='text-slate-500 text-sm'>Clients</p>
                            <p className='mt-1 text-slate-900 text-xl'>{clients}</p>
                            <div className='flex md:justify-normal justify-center'>
                                <ArrowUp size={12} className='text-green-700 mt-1.5'/>
                                <p className='mt-1 text-xs text-green-700'>12.37%</p>
                            </div>
                        </div>
                        <div className='md:text-left text-center'>
                            <p className='text-slate-500 text-sm'>Faire des réunions</p>
                            <p className='mt-1 text-slate-900 text-xl'>28.49%</p>
                            <div className='flex md:justify-normal justify-center'>
                                <ArrowDown size={12} className='text-red-700 mt-1.5'/>
                                <p className='mt-1 text-xs text-red-700'>12.37%</p>
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
                    <div className='font-medium md:text-md text-sm md:mr-0 mr-2'>
                        <p>Evenements</p>
                    </div>
                    <p className='text-slate-500 text-sm'>Nos evenements et leurs status</p>
                    <div className='mt-7 flex justify-between lg:w-8/12'>
                        <div className='md:text-left text-center'>
                            <p className='text-slate-500 text-sm'>Mensuel</p>
                            <p className='mt-1 text-slate-900 text-xl'>{augustEvents.length}</p>
                            <div className='flex md:justify-normal justify-center'>
                                {progressionPercentage < 0 ? (
                                    <>
                                        <ArrowDown size={12} className='text-red-700 mt-1.5'/>
                                        <p className='mt-1 text-xs text-red-700'>{progressionPercentage}%</p>
                                    </>
                                ) : (
                                    <>
                                        <ArrowUp size={12} className='text-green-700 mt-1.5'/>
                                        <p className='mt-1 text-xs text-green-700'>{progressionPercentage}%</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='md:text-left text-center'>
                            <p className='text-slate-500 text-sm'>Hebdomadaire</p>
                            <p className='mt-1 text-slate-900 text-xl'>{weeklyAverage}</p>
                            <div className='flex md:justify-normal justify-center'>
                                <ArrowDown size={12} className='text-red-700 mt-1.5'/>
                                <p className='mt-1 text-xs text-red-700'>{progressionWeekly}</p>
                            </div>
                        </div>
                        <div className='md:text-left text-center'>
                            <p className='text-slate-500 text-sm'>Journalier</p>
                            <p className='mt-1 text-slate-900 text-xl'>{dailyAverage}</p>
                            <div className='flex md:justify-normal justify-center'>
                                <ArrowUp size={12} className='text-green-700 mt-1.5'/>
                                <p className='mt-1 text-xs text-green-700'>0%</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <ChartEvents data={events}/>
                    </div>
                </div>
            </div>
            <div className='lg:flex'>
                <div className='bg-white rounded-sm p-5 mt-5 lg:w-7/12 border lg:mr-7'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='font-medium md:text-md text-sm md:mr-0 mr-2'>Clients par pays</p>
                        </div>
                        <div>
                                    <button
                                    id="30 jours button for country of clients"
                                    aria-label="30 jours button for country of clients"
                                    type="button"
                                    onClick={toggleMapDropdown}
                                    className="text-slate-900 bg-white font-medium border border-slate-200 rounded-sm text-sm px-5 py-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >   
                                    <div className='flex justify-end'>
                                        <p>{selectedMapPeriod}</p>
                                        {mapIsDropdownOpen ? <ChevronDown size={16} className='ml-3 mt-0.5'/> : <ChevronRight size={16} className='ml-3 mt-0.5'/>}
                                    </div>
                                </button>
                            <div
                        id="dropdown"
                            className={`z-10 ${mapIsDropdownOpen ? 'block' : 'hidden'} max-w-28 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2`}
                        >
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <p onClick={() => setSelectedMapPeriod('30 jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">30 jours</p>
                                </li>
                                <li>
                                    <p onClick={() => setSelectedMapPeriod('7 jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">7 jours</p>
                                </li>
                                <li>
                                    <p onClick={() => setSelectedMapPeriod('1 jour')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">1 jour</p>
                                </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <ChartMap />
                    </div>
                    <div className='mt-5'>
                        <div className="flex justify-between mb-3">
                            <div className=''>
                                <p className='text-sm text-slate-500'>France</p>
                            </div>
                            <div className='flex justify-between w-1/3'>
                                <p>130</p>
                                <p className='text-slate-500'>23.5%</p>
                            </div>
                        </div>
                        <div className="flex justify-between mb-3">
                            <div className=''>
                                <p className='text-sm text-slate-500'>United States</p>
                            </div>
                            <div className='flex justify-between w-1/3'>
                                <p>83</p>
                                <p className='text-slate-500'>7.16%</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className=''>
                                <p className='text-sm text-slate-500'>China</p>
                            </div>
                            <div className='flex justify-between w-1/3'>
                                <p>33</p>
                                <p className='text-slate-500'>3.49%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-white rounded-sm p-5 mt-5 lg:w-5/12 border'>
                <div className='flex justify-between'>
                        <div>
                            <p className='font-medium md:text-md text-xs md:text-sm md:mr-0 mr-2'>Sources principales des réunions</p>
                        </div>
                        <div>
                                    <button
                                    id="30 jours button for meetings"
                                    aria-label="30 jours button for meetings"
                                    type="button"
                                    onClick={toggleMeetingsDropdown}
                                    className="text-slate-900 bg-white font-medium border border-slate-200 rounded-sm text-sm px-5 py-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >   
                                    <div className='flex justify-end'>
                                        <p>{selectedMeetingsPeriod}</p>
                                        {isMeetingsDropdownOpen ? <ChevronDown size={16} className='ml-3 mt-0.5'/> : <ChevronRight size={16} className='ml-3 mt-0.5'/>}
                                    </div>
                                </button>
                            <div
                        id="dropdown"
                            className={`z-10 ${isMeetingsDropdownOpen ? 'block' : 'hidden'} max-w-28 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2`}
                        >
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <p onClick={() => setSelectedMeetingsPeriod('30 jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">30 jours</p>
                                </li>
                                <li>
                                    <p onClick={() => setSelectedMeetingsPeriod('7 jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">7 jours</p>
                                </li>
                                <li>
                                    <p onClick={() => setSelectedMeetingsPeriod('1 jour')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">1 jour</p>
                                </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <ChartMeetings data={meetings}/>
                    </div>
                </div>
            </div>
        </div>
    );
}