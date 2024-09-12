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

interface ClientData {
    id: number,
    join_date: string,
    name: string,
    country: string,
    country_code: string,
    count: number,
    percentage: number,
}

const getWeekNumber = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNumber = (date.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNumber + 3);
    const firstThursday = new Date(target.getUTCFullYear(), 0, 4);
    const diff = target.getTime() - firstThursday.getTime();
    return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
};

const clientData2 = [
    { id: 1, join_date: "10/09/2024", name: "Nathalie", country: "FR"},
    { id: 2, join_date: "10/09/2024", name: "Margaud", country: "US"},
    { id: 3, join_date: "10/09/2024", name: "Thérèse", country: "US"},
    { id: 4, join_date: "09/09/2024", name: "Marie", country: "US"},
    { id: 4, join_date: "09/09/2024", name: "Marie", country: "US"},
    { id: 5, join_date: "09/08/2024", name: "Jean",  country: "US"},
    { id: 2, join_date: "10/09/2024", name: "Margaud", country: "US"},
    { id: 3, join_date: "10/09/2024", name: "Thérèse", country: "US"},
    { id: 4, join_date: "09/09/2024", name: "Marie", country: "US"},
    { id: 4, join_date: "09/09/2024", name: "Marie", country: "US"},
    { id: 5, join_date: "09/08/2024", name: "Jean",  country: "US"},
    { id: 2, join_date: "10/09/2024", name: "Margaud", country: "US"},
    { id: 3, join_date: "10/09/2024", name: "Thérèse", country: "US"},
    { id: 4, join_date: "09/09/2024", name: "Marie", country: "US"},
    { id: 4, join_date: "09/09/2024", name: "Marie", country: "US"},
    { id: 5, join_date: "09/08/2024", name: "Jean",  country: "US"},
];

export default function Dashboard() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mapIsDropdownOpen, setMapIsDropdownOpen] = useState(false);
    const [lastDays, setLastDays] = useState("30 derniers jours");
    const [selectedPeriod, setSelectedPeriod] = useState('1M');
    const [selectedMapPeriod, setSelectedMapPeriod] = useState("30 jours");
    const [clientData, setData] = useState<ClientData[]>([]);
    const [isMeetingsDropdownOpen, setIsMeetingsDropdownOpen] = useState(false);
    const [selectedMeetingsPeriod, setSelectedMeetingsPeriod] = useState("30 jours");
    const [events, setEvents] = useState<Event[]>([]);
    const [meetings, setMeetings] = useState<Encounters[]>([]);
    const [augustEvents, setAugustEvents] = useState<Event[]>([]);
    const [dailyAverage, setDailyAverage] = useState<number>(0);
    const [progressionPercentage, setProgressionPercentage] = useState<number>(0);
    const [progressionDaily, setProgressionDaily] = useState<number>(0);
    const [clients, setClients] = useState<number>(0);
    const [clientsData, setClientsData] = useState<ClientData[]>([]);
    const [joinClients, setJoinClients] = useState([]);
    const [weekEvents, setWeekEvents] = useState<Event[]>([]);
    
    useEffect(() => {
        if (localStorage.getItem("needRefresh") === "true") {
          window.location.reload();
          localStorage.removeItem("needRefresh");
        }
      }
      , []);

      useEffect(() => {

        let route: string;

        if (selectedPeriod === '1M') {
            route = `http://localhost/last_month1_customers.php`
        } else if (selectedPeriod === '7J') {
            route = `http://localhost/last_week_customers.php`
        } else if (selectedPeriod === '3M') {
            route = `http://localhost/last_month_customers.php`
        }

        const fetchClientsData = async () => {
          try {
            const response = await sendPostRequest(
                route,
                {}
            );
            const data = JSON.parse(response);
            setJoinClients(data.customers);

            } catch (error) {
                console.error('Erreur lors de la requête : ', error);
            }
        }
        fetchClientsData();
    }, [selectedPeriod]);

    useEffect(() => {
        
        const fetchCoachData = async () => {
            try {
                const response = await sendPostRequest(
                    'http://localhost/employes_table.php',
                    {}
                );
                const data = JSON.parse(response);
                console.log(data);
            } catch (error) {
                console.error('Erreur lors de la requête : ', error);
            }
        }
        fetchCoachData();
    }, []);


      useEffect(() => {

        let route: string;

        if (selectedMapPeriod === '30 jours') {
            route = `http://localhost/last_month1_customers.php`
        } else if (selectedMapPeriod === '7 jours') {
            route = `http://localhost/last_week_customers.php`
        } else if (selectedMapPeriod === '3 mois') {
            route = `http://localhost/last_month_customers.php`
        }

        const fetchClientsData = async () => {
          try {
            const response = await sendPostRequest(
                route,
                {}
            );
            const data = JSON.parse(response);
            setData(data.customers);
            setClients(data.customers.length);

            const validClients = data.customers.filter((client: ClientData) => client.country && client.country !== 'null');

            const countryCount = validClients.reduce((acc: any, client: any) => {
              const country = client.country;
              if (!acc[country]) {
                acc[country] = { count: 0 };
              }
              acc[country].count++;
              return acc;
            }, {});

            const totalClients = validClients.length;

            let clientsByCountry = Object.keys(countryCount).map(country => ({
              country,
              count: countryCount[country].count,
              percentage: totalClients > 0 
                ? ((countryCount[country].count / totalClients) * 100).toFixed(2) 
                : 0,
            }));
    
            clientsByCountry = clientsByCountry.sort((a, b) => b.count - a.count);

            const topThreeCountries: any = clientsByCountry.slice(0, 3);
            const otherCountries = clientsByCountry.slice(3);
    
            if (otherCountries.length > 0) {
              const otherCount = otherCountries.reduce((acc, country) => acc + country.count, 0);
              const otherPercentage = totalClients > 0 
                ? ((otherCount / totalClients) * 100).toFixed(2) 
                : 0;
    
              topThreeCountries.push({
                country: 'Autres',
                count: otherCount,
                percentage: otherPercentage,
              });
            }
    
            setClientsData(topThreeCountries);
          } catch (error) {
            console.error('Erreur lors de la requête : ', error);
          }
        };
    
        fetchClientsData();
      }, [selectedMapPeriod]);

    const getEventsByMonth = (events: Event[], month: number, year: number): Event[] => {
        return events.filter((event: Event) => {
            const eventDate = new Date(event.date);
            if (isNaN(eventDate.getTime())) {
                console.warn(`Date invalide pour l'événement : ${event.date}`);
                return false;
            }
            return eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });
    };

    const getProgressionLastMonth = (events: Event[], month: number, year: number): number => {
        const eventsByMonth = getEventsByMonth(events, month, year);
        let previousMonth = getEventsByMonth(events, month - 1, year);
        if (previousMonth.length === 0) {
            return ((eventsByMonth.length - 1) / 1) * 100 + 100;
        }
        return ((eventsByMonth.length - previousMonth.length) / previousMonth.length) * 100;
    }

    const getEventsAvgDay = (events: Event[], month: number, year: number): number => {
        const eventsByMonth = getEventsByMonth(events, month, year);
        return eventsByMonth.length / 31;
    }

    const getProgressionAvgDay: (events: Event[], month: number, year: number) => number = (events: Event[], month: number, year: number): number => {
        const eventsByMonth: number = getEventsAvgDay(events, month, year);
        const previousMonth: number = getEventsAvgDay(events, month - 1, year);
        if (previousMonth === 0) {
            return ((eventsByMonth - 1) / 1) * 100 + 100;
        }
        return previousMonth > 0 ? ((eventsByMonth - previousMonth) / previousMonth) * 100 : 0;
    }


    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await sendPostRequest('http://localhost/statistics.php', {});
                const data = JSON.parse(response);
                const events = data.data.events;
                const clients = data.data.clients;
    
                setEvents(events);

                const august: Event[] = getEventsByMonth(events, 8, 2024);

                const progressionMonth: number = getProgressionLastMonth(events, 8, 2024);

                const dailyAvgAug: number = getEventsAvgDay(events, 8, 2024);

                const progressionDay = getProgressionAvgDay(events, 8, 2024);
    
                setAugustEvents(august);
                setDailyAverage(dailyAvgAug);
                setProgressionPercentage(progressionMonth);
                setProgressionDaily(progressionDay);
            } catch (error) {
                console.error('Erreur lors de la requête : ', error);
            }
        };
        
        const fetchDataWeek = async () => {
            try {
                const response = await sendPostRequest('http://localhost/last_week_events.php', {});
                const data = JSON.parse(response);
                setWeekEvents(data.events);
                
            } catch (error) {
                console.error('Erreur lors de la requête : ', error);
            }
        };

        fetchData();
        fetchDataWeek();
    }, []);

    useEffect(() => {
        console.log(augustEvents);
    }, [augustEvents]);

    useEffect(() => {

        let route: string;

        if (selectedMeetingsPeriod === '30 jours') {
            route = `http://localhost/last_month1_encounters.php`
        } else if (selectedMeetingsPeriod === '7 jours') {
            route = `http://localhost/last_week_encounters.php`
        } else if (selectedMeetingsPeriod === '3 mois') {
            route = `http://localhost/last_month_encounters.php`
        }

        const fetchClientsData = async () => {
          try {
            const response = await sendPostRequest(
              route,
              {}
            );
            const data = JSON.parse(response);

            const meetings = data.encounters;
            setMeetings(meetings);

          } catch (error) {
            console.error('Erreur lors de la requête : ', error);
          }
        };
    
        fetchClientsData();
      }, [selectedMeetingsPeriod]);

  const handlePeriodClick: (period: string) => void = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleMeetingsPeriodClick: (period: string) => void = (
    period: string
  ) => {
    setSelectedMeetingsPeriod(period);
  };

  const toggleMapDropdown: () => void = () => {
    setMapIsDropdownOpen(!mapIsDropdownOpen);
  };

  const toggleDropdown: () => void = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMeetingsDropdown: () => void = () => {
    setIsMeetingsDropdownOpen(!isMeetingsDropdownOpen);
  };

  useEffect(() => {
    setMapIsDropdownOpen(mapIsDropdownOpen);
  }, [mapIsDropdownOpen]);

  useEffect(() => {
    setLastDays(lastDays);
     if (lastDays === '30 derniers jours') {
        setSelectedPeriod('1M');
        setSelectedMapPeriod('30 jours');
        setSelectedMeetingsPeriod('30 jours');
    } else if (lastDays === '7 derniers jours') {
        setSelectedPeriod('7J');
        setSelectedMapPeriod('7 jours');
        setSelectedMeetingsPeriod('7 jours');
    } else if (lastDays === '3 derniers mois') {
        setSelectedPeriod('3M');
        setSelectedMapPeriod('3 mois');
        setSelectedMeetingsPeriod('3 mois');
    }
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
        id="dropdownDays"
            className={`z-10 ${isDropdownOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2`}
        >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <p onClick={() => setLastDays('3 derniers mois')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">3 derniers mois</p>
                </li>
                <li>
                    <p onClick={() => setLastDays('30 derniers jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">30 derniers jours</p>
                </li>
                <li>
                    <p onClick={() => setLastDays('7 derniers jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">7 derniers jours</p>
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
                                    className={`text-xs border px-2 py-1 cursor-pointer ${selectedPeriod === '7J' ? 'bg-slate-100' : 'bg-white'}`}
                                    onClick={() => handlePeriodClick('7 jours')}
                                >
                                    7 J
                                </p>
                                <p
                                    className={`text-xs border px-2 py-1 cursor-pointer ${selectedPeriod === '1M' ? 'bg-slate-100' : 'bg-white'}`}
                                    onClick={() => handlePeriodClick('30 jours')}
                                >
                                    1 M
                                </p>
                                <p
                                    className={`text-xs border px-2 py-1 cursor-pointer ${selectedPeriod === '3M' ? 'bg-slate-100' : 'bg-white'}`}
                                    onClick={() => handlePeriodClick('3 mois')}
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
                            <p className='mt-1 text-xs text-green-700'>{((clients - 1) / 1) * 100} %</p>
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
                    {clientsData.length > 0 ? 
                        <CustomersOverView clientData={joinClients} period={selectedPeriod} />
                        :
                        <div className='flex h-full justify-center items-center'>
                            <p className='text-xl text-slate-300'>Aucune données à afficher</p>
                        </div>
                    }
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
                        <p className='mt-1 text-slate-900 text-xl'>{weekEvents.length}</p>
                        <div className='flex md:justify-normal justify-center'>
                            <ArrowDown size={12} className='text-red-700 mt-1.5'/>
                            <p className='mt-1 text-xs text-red-700'>0</p>
                        </div>
                    </div>
                    <div className='md:text-left text-center'>
                        <p className='text-slate-500 text-sm'>Journalier</p>
                        <p className='mt-1 text-slate-900 text-xl'>{dailyAverage.toPrecision(3)}</p>
                        <div className='flex md:justify-normal justify-center'>
                            {progressionDaily < 0 ? (
                                <>
                                    <ArrowDown size={12} className='text-red-700 mt-1.5'/>
                                    <p className='mt-1 text-xs text-red-700'>{progressionDaily.toPrecision(2)}%</p>
                                </>
                            ) : (
                                <>
                                    <ArrowUp size={12} className='text-green-700 mt-1.5'/>
                                    <p className='mt-1 text-xs text-green-700'>{progressionDaily.toPrecision(2)}%</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    {augustEvents.length > 0 ?
                        <ChartEvents data={augustEvents}/>
                        :
                        <div className='flex h-full justify-center items-center'>
                            <p className='text-xl text-slate-300'>Aucune données à afficher</p>
                        </div>
                    }
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
                                <p onClick={() => setSelectedMapPeriod('3 mois')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">3 derniers mois</p>
                            </li>
                            <li>
                                <p onClick={() => setSelectedMapPeriod('30 jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">30 jours</p>
                            </li>
                            <li>
                                <p onClick={() => setSelectedMapPeriod('7 jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">7 jours</p>
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center'>
                    { clientData.length > 0 ? 
                        <ChartMap clientData={clientData}/>
                        :
                        <div className='flex h-full justify-center items-center'>
                            <p className='text-xl text-slate-300'>Aucune données à afficher</p>
                        </div>
                    }
                </div>
                <div className='mt-5'>
                {clientsData.map((countryData, index) => (
                    <div className="flex justify-between mb-3" key={index}>
                    <div className=''>
                        <p className='text-sm text-slate-500'>{countryData.country}</p>
                    </div>
                    <div className='flex justify-between w-1/3'>
                        <p>{countryData.count}</p>
                        <p className='text-slate-500'>{countryData.percentage}%</p>
                    </div>
                    </div>
                ))}
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
                                <p onClick={() => setSelectedMeetingsPeriod('3 mois')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">3 mois</p>
                            </li>
                            <li>
                                <p onClick={() => setSelectedMeetingsPeriod('30 jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">30 jours</p>
                            </li>
                            <li>
                                <p onClick={() => setSelectedMeetingsPeriod('7 jours')} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">7 jours</p>
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center h-full'>
                {meetings.length > 0 ?
                        <ChartMeetings data={meetings}/>
                        :
                        <div className='flex h-full justify-center items-center'>
                            <p className='text-xl text-slate-300'>Aucune données à afficher</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  );
}
