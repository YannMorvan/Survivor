import React, { useEffect, useState } from 'react';
import { sendPostRequest } from '../utils/utils';
import Event from './event';
import MonthView from './calendar/monthView';
import WeekView from './calendar/weekView';
import DayView from './calendar/dayView';
import ListView from './calendar/listView';
import { get } from 'http';

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

const Calendar = ({ month, view, onEventClick }: any) => {
    const [events, setEvents] = useState([]);

    console.log(view);

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

    useEffect(() => {
        const getEventsByView = (events: Event[], view: string, selectedMonth: string) => {
            const [monthName, year] = selectedMonth.split(' ');
            const monthIndex = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
            const selectedYear = parseInt(year, 10);
            console.log(view);

            const getWeekOfMonth = (date: Date) => {
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
                return Math.ceil((date.getDate() + firstDay) / 7);
            };
        
            const filteredEvents = events.filter(event => {
            const eventDate = new Date(event.date);
        
                switch (view) {
                    case 'mois':
                        return eventDate.getMonth() === monthIndex && eventDate.getFullYear() === selectedYear;
                    
                    case 'semaine':
                        const currentWeek = getWeekOfMonth(new Date());
                        const eventWeek = getWeekOfMonth(eventDate);
                        return eventDate.getMonth() === monthIndex && eventDate.getFullYear() === selectedYear && currentWeek === eventWeek;
        
                    case 'jour':
                        const today = new Date();
                        return eventDate.toDateString() === today.toDateString();
                    
                    case 'liste':
                        return true;
        
                    default:
                        return false;
                }
            });
        
            return filteredEvents;
        };

        getEventsByView(events, view, month);
    }, [view]);
    

    return (
        <div className="bg-white pb-5 mt-3">
            <div className="max-w-11/12 ml-10 mr-10">
                <div className="wrapper bg-white rounded-xl w-full">
                    {view === 'mois' && (
                        <MonthView events={filteredEvents} onEventClick={onEventClick} />
                    )}
                    {view === 'semaine' && (
                        <WeekView events={filteredEvents} onEventClick={onEventClick} />
                    )}
                    {view === 'jour' && (
                        <DayView events={filteredEvents} onEventClick={onEventClick} />
                    )}
                    {view === 'liste' && (
                        <ListView events={filteredEvents} onEventClick={onEventClick} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
