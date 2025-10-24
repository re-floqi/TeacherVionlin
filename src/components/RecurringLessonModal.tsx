import React, { useState } from 'react';
import Modal from 'react-modal';

const RecurringLessonModal = ({ isOpen, onRequestClose }) => {
    const [frequency, setFrequency] = useState('weekly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [lessonDetails, setLessonDetails] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle the submission of recurring lesson details
        // This could involve calling a function from supabaseService.js
        console.log({ frequency, startDate, endDate, lessonDetails });
        onRequestClose(); // Close the modal after submission
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>Manage Recurring Lessons</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Frequency:</label>
                    <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Lesson Details:</label>
                    <textarea
                        value={lessonDetails}
                        onChange={(e) => setLessonDetails(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={onRequestClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default RecurringLessonModal;