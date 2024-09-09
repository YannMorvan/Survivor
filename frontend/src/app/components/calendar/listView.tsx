import React from 'react';
import Event from '../event';

const ListView = ({ events, onEventClick }: any) => {
    return (
        <div>
            <h3>Liste des événements</h3>
            {events.map((event: any, index: number) => (
                <Event key={event.id} event={event} index={index} onEventClick={onEventClick} />
            ))}
        </div>
    );
};

export default ListView;
