import React, { useState } from 'react';

const LessonForm = ({ onSubmit, initialData }) => {
    const [lessonData, setLessonData] = useState(initialData || {
        title: '',
        date: '',
        duration: '',
        charge: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLessonData({
            ...lessonData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(lessonData);
        setLessonData({
            title: '',
            date: '',
            duration: '',
            charge: '',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Lesson Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={lessonData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={lessonData.date}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="duration">Duration (minutes):</label>
                <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={lessonData.duration}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="charge">Charge ($):</label>
                <input
                    type="number"
                    id="charge"
                    name="charge"
                    value={lessonData.charge}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Save Lesson</button>
        </form>
    );
};

export default LessonForm;