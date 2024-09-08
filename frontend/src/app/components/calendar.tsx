import React, { useEffect, useState } from 'react';
import { sendPostRequest } from '../utils/utils';
import Event from './event';

interface Event {
    id: number;
    name: string;
    date: string;
    duration: number;
    location_name: string;
}

const getEventsByMonth: (events: Event[], month: number, year: number) => Event[] = (events: Event[], month: number, year: number): Event[] => {
    return events.filter(event => {
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) {
            console.warn(`Date invalide pour l'événement : ${event.date}`);
            return false;
        }
        return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
};

const Calendar = ({ month, onEventClick }: any) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchClientsData = async () => {
            try {
                const response = await sendPostRequest(
                    'http://localhost/statistics.php',
                    {}
                );
                
                const data = JSON.parse(response);
                const fetchedEvents = data.data.events;
                console.log(fetchedEvents);
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Erreur lors de la requête : ", error);
            }
        };
    
        fetchClientsData();
    }, []);

    const daysInMonth = 30;

    const [monthName, year] = month.split(' ');
    const monthIndex = new Date(Date.parse(monthName + " 1, 2024")).getMonth();

    const filteredEvents = getEventsByMonth(events, monthIndex, parseInt(year));

    const getDayEvents = (dayNumber: number) => {
        return filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayNumber;
        });
    };

    return (
        <div className="bg-white pb-5 mt-3">
            <div className="max-w-11/12 ml-10 mr-10">
                <div className="wrapper bg-white rounded-xl w-full">
                    <div className="header flex justify-between border-b p-2">
                        <div className="buttons">
                        </div>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                                    <th key={day} className="p-2 border-r border-l h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
                                        <span className="xl:block lg:block md:block sm:block hidden">{day}</span>
                                        <span className="xl:hidden lg:hidden md:hidden sm:hidden block">{day.slice(0, 3)}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: Math.ceil(daysInMonth / 7) }).map((_, rowIndex) => (
                                <tr key={rowIndex} className="text-right mr-0 h-20">
                                    {Array.from({ length: 7 }).map((_, colIndex) => {
                                        const dayNumber = rowIndex * 7 + colIndex + 1;
                                        return dayNumber <= daysInMonth ? (
                                            <td
                                                key={colIndex}
                                                className="border pt-1 h-30 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto cell"
                                            >
                                                <div className="flex flex-col h-36 xl:w-50 lg:w-50 md:w-50 sm:w-full w-10 overflow-hidden relative">
                                                    <div className="top h-5 w-full">
                                                        <span className="text-gray-500">{dayNumber}</span>
                                                    </div>
                                                    <div className="bottom flex-grow py-1 w-full cursor-pointer flex items-start justify-start relative">
                                                        {getDayEvents(dayNumber).map((event, index) => (
                                                            <Event key={event.id} event={event} index={index} onEventClick={onEventClick}/>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        ) : (
                                            <td
                                                key={colIndex}
                                                className="border p-1 h-30 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto"
                                            />
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
