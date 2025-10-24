import React from 'react';
import { useAuth } from '../hooks/useAuth';
import CalendarView from '../components/CalendarView';
import LessonList from '../components/LessonList';
import LessonForm from '../components/LessonForm';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Please log in to access the dashboard.</div>;
    }

    return (
        <div>
            <h1>Lesson Tracker Dashboard</h1>
            <LessonForm />
            <CalendarView />
            <LessonList />
        </div>
    );
};

export default Dashboard;