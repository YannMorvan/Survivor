import React from 'react';
import Event from '../event';

interface WeekViewProps {
    events: any[];
    onEventClick: (event: any) => void;
    startDate: Date; // Date de début de la semaine
}

const WeekView = ({ events, onEventClick, list, startDate }: any) => {
    const daysInWeek = 7;

    const getDayEvents = (dayIndex: number) => {
        const currentDay = new Date(startDate);
        currentDay.setDate(currentDay.getDate() + dayIndex);

        return events.filter((event: any) => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === currentDay.getDate() &&
                eventDate.getMonth() === currentDay.getMonth() &&
                eventDate.getFullYear() === currentDay.getFullYear()
            );
        });
    };

    const allWeekEvents = Array.from({ length: daysInWeek }).map((_, dayIndex) => {
        const currentDay = new Date(startDate);
        currentDay.setDate(currentDay.getDate() + dayIndex);
        const dayEvents = getDayEvents(dayIndex);
        return { currentDay, dayEvents };
    });

    return (
        <div>
            {list ? (
                <div className="list-view">
                    {allWeekEvents.length > 0 ? (
                        allWeekEvents.map(({ currentDay, dayEvents }, index) => (
                            <div key={index} className="flex border-b pb-5 mt-5">
                                <p className="text-2xl w-2/12">
                                    {currentDay.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                                <div className="w-10/12">
                                    {dayEvents.length > 0 ? (
                                        dayEvents.map((event: any, eventIndex: number) => (
                                            <div key={eventIndex} className="mb-2 bg-sky-600 rounded p-1.5">
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
                        <p className="text-center">Aucun événement cette semaine.</p>
                    )}
                </div>
            ) : (
                <table className="w-full h-full h-[500px]">
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
                                const currentDay = new Date(startDate);
                                currentDay.setDate(currentDay.getDate() + colIndex);

                                return (
                                    <td
                                        key={colIndex}
                                        className="border pt-1 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto cell"
                                    >
                                        <div className="flex flex-col h-full xl:w-50 lg:w-50 md:w-50 sm:w-full w-10 overflow-hidden relative">
                                            <div className="top h-5 w-full">
                                                <span className="text-gray-500">{currentDay.getDate()}</span>
                                            </div>
                                            <div className="bottom flex-grow py-1 w-full cursor-pointer flex items-start justify-start relative">
                                                {getDayEvents(colIndex).map((event: any, index: number) => (
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
            )}
        </div>
    );
};

export default WeekView;
