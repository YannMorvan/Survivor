import React from 'react';
import Event from '../event';

const DayView = ({ events, onEventClick }: any) => {
    const getDayEvents = (dayNumber: number) => {
        return events.filter((event: any) => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayNumber;
        });
    };

    const today = new Date().getDate(); // Vous pouvez passer une date spécifique si nécessaire

    return (
        <div>
            <h3>Événements pour aujourd'hui</h3>
            {getDayEvents(today).map((event: any, index: number) => (
                <Event key={event.id} event={event} index={index} onEventClick={onEventClick} />
            ))}
        </div>
    );
};

export default DayView;
