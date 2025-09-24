import { useState, useEffect } from 'react';
export const useDateTimePicker = (initialDate) => {
  const [fullDate, setFullDate] = useState(initialDate);
  const [dateInput, setDateInput] = useState('');

  useEffect(() => {
    const year = fullDate.getFullYear();
    const month = String(fullDate.getMonth() + 1).padStart(2, '0');
    const day = String(fullDate.getDate()).padStart(2, '0');
    setDateInput(`${year}-${month}-${day}`);
  }, [fullDate]);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentHours = fullDate.getHours();
    const currentMinutes = fullDate.getMinutes();
    selectedDate.setHours(currentHours, currentMinutes);

    setFullDate(selectedDate);
  };

  return { dateInput, handleDateChange, fullDate };
};