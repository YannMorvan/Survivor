import React from 'react';
import Event from '../event';

const WeekView = ({ events, onEventClick }: any) => {
    const daysInWeek = 7;

    const getDayEvents = (dayNumber: number) => {
        return events.filter((event: any) => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayNumber;
        });
    };

    return (
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
                <tr className="text-right mr-0 h-20">
                    {Array.from({ length: daysInWeek }).map((_, colIndex) => {
                        const dayNumber = colIndex + 1;
                        return (
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
                        );
                    })}
                </tr>
            </tbody>
        </table>
    );
};

export default WeekView;
