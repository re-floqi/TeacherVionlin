import React from 'react';

const LessonList = ({ lessons }) => {
    return (
        <div>
            <h2>Lesson List</h2>
            {lessons.length === 0 ? (
                <p>No lessons scheduled for this date.</p>
            ) : (
                <ul>
                    {lessons.map((lesson) => (
                        <li key={lesson.id}>
                            <strong>{lesson.title}</strong> - {lesson.date} ({lesson.duration} mins) - ${lesson.charge}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LessonList;