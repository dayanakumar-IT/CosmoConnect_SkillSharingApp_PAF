import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ startDate, endDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return <div className="text-red-400 font-bold">Time's up!</div>;

  return (
    <div className="text-center my-4">
      <div className="text-lg font-bold text-purple-400">Time Remaining</div>
      <div className="text-2xl font-mono text-white">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    </div>
  );
};

export default CountdownTimer; 