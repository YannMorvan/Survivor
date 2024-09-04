import { color } from '@amcharts/amcharts5';
import React from 'react';

const Calendar = () => {

    const daysInMonth = 30;

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
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
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
                            <div className="flex flex-col h-36 xl:w-50 lg:w-50 md:w-50 sm:w-full w-10 overflow-hidden">
                                <div className="top h-5 w-full">
                                <span className="text-gray-500">{dayNumber}</span>
                                </div>
                                <div className="bottom flex-grow py-1 w-full cursor-pointer flex items-start justify-start">
                                {dayNumber === 1 && (
                                    <div
                                    className="event"
                                    style={{
                                        width: "200%",
                                        backgroundColor: "red"
                                    }}
                                    >
                                    <span className="event-name">Meeting</span>
                                    <span className="ml-2">12:00~14:00</span>
                                    </div>
                                )}
                                </div>
                                <div className="bottom flex-grow py-1 w-full cursor-pointer flex items-start justify-start">
                                {dayNumber === 4 && (
                                    <div
                                    className="event"
                                    style={{
                                        width: "200%",
                                    }}
                                    >
                                    <span className="event-name">Meeting</span>
                                    <span className="ml-2">17:00~19:00</span>
                                    </div>
                                )}
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