import React from 'react';

interface HeartbeatProps {
  compatibility: number;
}

const Heartbeat: React.FC<HeartbeatProps> = ({ compatibility }) => {
  let animationClass = '';

  if (compatibility < 60) {
    animationClass = 'animate-heartbeat-slow';
  } else if (compatibility < 75) {
    animationClass = 'animate-heartbeat';
  } else if (compatibility < 100) {
    animationClass = 'animate-heartbeat-fast';
  }

  return (
    <main className="flex items-center justify-center">
      <div className={`text-red-500 ${animationClass} text-9xl`}>❤️</div>
    </main>
  );
};

export default Heartbeat;
