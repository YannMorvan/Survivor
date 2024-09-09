import React from 'react';
import Event from '../event';

const DayView = ({ events, day, onEventClick }: any) => {
    const dayNumber = day.getDate();
    const monthIndex = day.getMonth();
    const year = day.getFullYear();

    const getDayEvents = (dayNumber: number) => {
        return events.filter((event: any) => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayNumber && eventDate.getMonth() === monthIndex && eventDate.getFullYear() === year;
        });
    };

    return (
        <div className="bg-white p-5 h-[500px]">
            <table className="w-full h-full">
                <thead>
                    <tr>
                        <th className="p-2 border-r border-l h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs text-center">
                            Événements du {day.toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border pt-1 h-30 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto">
                            <div className="flex flex-col h-full xl:w-50 lg:w-50 md:w-50 sm:w-full w-full overflow-hidden relative">
                                <div className="bottom flex-grow mr-3 py-1 w-full cursor-pointer flex flex-col items-start justify-start relative">
                                    {getDayEvents(dayNumber).map((event: any, index: number) => (
                                        <Event key={event.id} event={event} index={index} onEventClick={onEventClick} />
                                    ))}
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DayView;
