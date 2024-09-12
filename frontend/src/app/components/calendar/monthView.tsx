import React, { useState } from 'react';
import Event from '../event';

const MonthView = ({ events, month, list, onEventClick }: any) => {
    const [monthName, year] = month.split(' ');
    const monthIndex = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
    const yearNumber = parseInt(year, 10);

    const getDaysInMonth = (monthIndex: number, year: number) => {
        return new Date(year, monthIndex + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(monthIndex, yearNumber);

    const getDayEvents = (dayNumber: number) => {
        return events.filter((event: any) => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayNumber && eventDate.getMonth() === monthIndex && eventDate.getFullYear() === yearNumber;
        });
    };

    const allMonthEvents = Array.from({ length: daysInMonth }).reduce((acc: any[], _, dayIndex) => {
        const dayNumber = dayIndex + 1;
        const dayEvents = getDayEvents(dayNumber);
        acc.push({ dayNumber, events: dayEvents });
        return acc;
    }, []);

    return (
        <div>
            {list ? (
                <div className="list-view">
                    {allMonthEvents.length > 0 ? (
                        allMonthEvents.map(({ dayNumber, events }: any, index: number) => (
                            <div key={index} className="flex border-b pb-5 mt-5">
                                <p className="text-2xl w-2/12">
                                    {new Date(yearNumber, monthIndex, dayNumber).toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                                <div className="w-10/12">
                                    {events.length > 0 ? (
                                        events.map((event: any, eventIndex: number) => (
                                            <div key={eventIndex} className="mb-2 rounded p-1.5" style={{backgroundColor: `${event.color}`}}>
                                                <p className="text-white cursor-pointer" onClick={() => onEventClick(event)}>
                                                    {event.name}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Aucun événement</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Aucun événement pour ce mois.</p>
                    )}
                </div>
            ) : (
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
                                                    {getDayEvents(dayNumber).map((event: any, index: number) => (
                                                        <Event key={event.id} event={event} index={index} onEventClick={onEventClick} />
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
            )}
        </div>
    );
};

export default MonthView;
