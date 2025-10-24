import React, { useEffect, useState } from 'react';
import { getLessonsByDateRange } from '../services/supabaseService';
import CalendarView from '../components/CalendarView';
import LessonList from '../components/LessonList';

const Lessons = () => {
    const [lessons, setLessons] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchLessons = async () => {
            const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
            const fetchedLessons = await getLessonsByDateRange(startDate, endDate);
            setLessons(fetchedLessons);
        };

        fetchLessons();
    }, [selectedDate]);

    return (
        <div>
            <h1>Lessons Tracker</h1>
            <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <LessonList lessons={lessons} />
        </div>
    );
};

export default Lessons;