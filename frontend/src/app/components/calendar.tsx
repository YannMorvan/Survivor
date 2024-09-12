import React, { useEffect, useState } from 'react';
import { sendPostRequest } from '../utils/utils';
import MonthView from './calendar/monthView';
import WeekView from './calendar/weekView';
import DayView from './calendar/dayView';
import ListView from './calendar/listView';

interface Event {
    id: number;
    name: string;
    date: string;
    duration: number;
    location_name: string;
}

const getEventsByMonth = (events: Event[], month: number, year: number): Event[] => {
    return events.filter(event => {
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) {
            console.warn(`Date invalide pour l'événement : ${event.date}`);
            return false;
        }
        return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
};

const Calendar = ({ month, week, day, list, view, onEventClick }: any) => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchClientsData = async () => {
            try {
                const response = await sendPostRequest(
                    'http://localhost/statistics.php',
                    {}
                );
                
                const data = JSON.parse(response);
                const fetchedEvents = data.data.events;
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Erreur lors de la requête : ", error);
            }
        };
    
        fetchClientsData();
    }, [month]);

    const [monthName, year] = month.split(' ');
    const monthIndex = new Date(Date.parse(monthName + " 1, 2024")).getMonth();

    const filteredEvents = getEventsByMonth(events, monthIndex, parseInt(year));

    const getEventsByWeek = (events: Event[], weekStartDate: Date) => {
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 7);

        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= weekStartDate && eventDate < weekEndDate;
        });
    };

    const getEventsByDay = (events: Event[], selectedDay: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === selectedDay.toDateString();
        });
    };

    const getEventsByView = (events: Event[], view: string, selectedMonth: string, selectedDay: Date) => {
        const [monthName, year] = selectedMonth.split(' ');
        const monthIndex = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
        const selectedYear = parseInt(year, 10);

        switch (view) {
            case 'mois':
                return getEventsByMonth(events, monthIndex, selectedYear);
            
            case 'semaine':
                return getEventsByWeek(events, week);
            
            case 'jour':
                return getEventsByDay(events, selectedDay);
            
            case 'liste':
                return events;
            
            default:
                return [];
        }
    };

    const viewEvents = getEventsByView(events, view, month, day);

    return (
        <div className="bg-white pb-5 mt-3">
            <div className="max-w-11/12 ml-10 mr-10">
                <div className="wrapper bg-white rounded-xl w-full">
                    {view === 'mois' && (
                        <MonthView events={viewEvents} list={list} month={month} onEventClick={onEventClick} />
                    )}
                    {view === 'semaine' && (
                        <WeekView events={viewEvents} list={list} startDate={week} onEventClick={onEventClick} />
                    )}
                    {view === 'jour' && (
                        <DayView events={viewEvents} list={list} day={day} onEventClick={onEventClick} />
                    )}
                    {view === 'liste' && (
                        <ListView events={viewEvents} onEventClick={onEventClick} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
