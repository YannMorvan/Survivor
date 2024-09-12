import React, { useMemo } from 'react';

const getRandomColor: () => string = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const getAfterComma: (str: string) => string = (str: string) => {
    return str.split(',')[1];
};

const Event = ({ event, index, onEventClick }: any) => {
    const { date, duration, name, location_name, color } = event;

    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + duration * 60000);

    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

    const verticalOffset = index * 30;

    const handleClick = () => {
        if (onEventClick) {
            onEventClick(event);
        }
    };

    return (
        <div
            className="event cursor-pointer"
            style={{
                width: `${dayCount * 100}%`,
                backgroundColor: color,
                position: 'absolute',
                top: `${verticalOffset}px`,
                left: '0',
                height: '30px',
            }}
            onClick={handleClick}
        >
            <span className="event-name p-5 font-semibold">
                &#x2022; {name} ({getAfterComma(location_name)} )
            </span>
        </div>
    );
};

export default Event;
