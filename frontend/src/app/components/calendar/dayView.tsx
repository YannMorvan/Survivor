import React from 'react';
import Event from '../event';

const DayView = ({ events, day, list, onEventClick }: any) => {
    const dayNumber = day.getDate();
    const monthIndex = day.getMonth();
    const year = day.getFullYear();

    const getDayEvents = (dayNumber: number) => {
        return events.filter((event: any) => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayNumber && eventDate.getMonth() === monthIndex && eventDate.getFullYear() === year;
        });
    };

    const dayEvents = getDayEvents(dayNumber);
    
    console.log(dayEvents);

    const handleClick = (event: any) => {
        if (onEventClick) {
            onEventClick(event);
        }
    };

    return (
        <div>
            {list ? (
                <div className='list-view'>
                    <div className='flex border-b pb-5 mt-5'>
                        <p className='text-2xl mt-2 w-2/12'>{day.toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <div className='w-10/12'>
                            <div className={`${dayEvents.length === 0 ? '' : ''} w-full rounded p-1.5`}>
                                {dayEvents.length > 0 ? (
                                    dayEvents.map((event: any, index: number) => (
                                        <div key={event.id} className='mb-2 bg-sky-600 rounded p-1.5'>
                                            <p className='text-white cursor-pointer' onClick={() => handleClick(event)}>
                                                {event.name}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className=''>Aucun événement</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
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
                                <td className="border h-full pt-1 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto">
                                    <div className="flex flex-col h-full xl:w-50 lg:w-50 md:w-50 sm:w-full w-full overflow-hidden relative">
                                        <div className="bottom flex-grow mr-3 py-1 w-full cursor-pointer flex flex-col items-start justify-start relative">
                                            {dayEvents.map((event: any, index: number) => (
                                                <Event key={event.id} event={event} index={index} onEventClick={onEventClick} />
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DayView;
