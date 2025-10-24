import React, { useEffect, useState } from 'react';
import { getLessonsByDateRange } from '../services/supabaseService';
import { format } from 'date-fns';

const CalendarView = () => {
    const [lessons, setLessons] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchLessons = async () => {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const lessonsData = await getLessonsByDateRange(startDate, endDate);
            setLessons(lessonsData);
        };

        fetchLessons();
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const calendarDays = [];

        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const lessonForDay = lessons.find(lesson => new Date(lesson.date).getDate() === day);
            calendarDays.push(
                <div key={day} className={`calendar-day ${lessonForDay ? 'has-lesson' : ''}`}>
                    {day}
                    {lessonForDay && <div className="lesson-info">{lessonForDay.title}</div>}
                </div>
            );
        }

        return calendarDays;
    };

    return (
        <div className="calendar-view">
            <header>
                <button onClick={handlePrevMonth}>Previous</button>
                <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={handleNextMonth}>Next</button>
            </header>
            <div className="calendar-grid">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default CalendarView;