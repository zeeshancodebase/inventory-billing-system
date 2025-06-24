import React, { useEffect, useState } from 'react';
import './ClockWidget.css'; // Import CSS

function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 📌 Combine into a single ISO-compatible datetime string (e.g. for input fields)
  const offset = time.getTimezoneOffset();
  const currentDateTime = new Date(time.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 16); // YYYY-MM-DDTHH:MM

  // console.log('Current DateTime:', currentDateTime); // Debug output (optional)

  return (
    <div className="clock-widget">
      <div className="clock-time">{formattedTime}</div>
      <div className="clock-date">{formattedDate}</div>
    </div>
  );
}

export default ClockWidget;
