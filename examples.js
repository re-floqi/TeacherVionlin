/**
 * Example Usage of Supabase Service
 * 
 * This file demonstrates how to use the supabaseService functions
 * in a React application.
 */

import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getLessonsByDateRange,
  addLesson,
  updateLessonPayment,
  deleteLesson,
  getRecurringLessons,
  addRecurringLesson,
  deleteRecurringLesson,
  getLessonsByStudent,
  getLessonsByPaymentStatus
} from './supabaseService';

/**
 * Example 1: Managing Students
 */
async function exampleStudentOperations() {
  try {
    // Add a new student
    console.log('Adding new student...');
    const newStudent = await addStudent({
      onoma_mathiti: 'Μαρία',
      epitheto_mathiti: 'Παπαδοπούλου',
      etos_gennisis: 2012,
      onoma_gonea: 'Νίκος',
      epitheto_gonea: 'Παπαδόπουλος',
      kinhto_tilefono: '6912345678',
      email: 'nikos.papadopoulos@example.com',
      megethos_violiou: '3/4',
      default_diarkeia: 45,
      default_timi: 25.00,
      simiwseis: 'Πολύ ικανή μαθήτρια, προχωρημένο επίπεδο'
    });
    console.log('New student created:', newStudent);

    // Get all students
    console.log('Fetching all students...');
    const students = await getStudents();
    console.log(`Found ${students.length} students`);

    // Update a student
    console.log('Updating student...');
    const updatedStudent = await updateStudent(newStudent.student_id, {
      default_timi: 30.00,
      simiwseis: 'Αύξηση τιμής λόγω προχωρημένου επιπέδου'
    });
    console.log('Student updated:', updatedStudent);

    // Delete a student (commented out for safety)
    // await deleteStudent(newStudent.student_id);
    // console.log('Student deleted');

  } catch (error) {
    console.error('Error in student operations:', error);
  }
}

/**
 * Example 2: Managing Lessons
 */
async function exampleLessonOperations() {
  try {
    // First, get a student (assuming student_id = 1 exists)
    const students = await getStudents();
    if (students.length === 0) {
      console.log('No students found. Please add a student first.');
      return;
    }
    const studentId = students[0].student_id;

    // Add a new lesson
    console.log('Adding new lesson...');
    const newLesson = await addLesson({
      student_id: studentId,
      imera_ora_enarksis: new Date('2025-10-25T17:00:00'),
      diarkeia_lepta: 45,
      timi: 25.00,
      katastasi_pliromis: 'pending',
      simiwseis_mathimatos: 'Εξάσκηση στη δεύτερη συμφωνία του Mozart'
    });
    console.log('New lesson created:', newLesson);

    // Get lessons for a date range
    console.log('Fetching lessons for October 2025...');
    const startDate = new Date('2025-10-01');
    const endDate = new Date('2025-10-31');
    const lessons = await getLessonsByDateRange(startDate, endDate);
    console.log(`Found ${lessons.length} lessons in October 2025`);

    // Get lessons for a specific student
    console.log('Fetching lessons for student...');
    const studentLessons = await getLessonsByStudent(studentId);
    console.log(`Student has ${studentLessons.length} lessons`);

    // Update lesson payment status
    console.log('Updating lesson payment status...');
    const updatedLesson = await updateLessonPayment(newLesson.lesson_id, 'paid');
    console.log('Lesson payment updated:', updatedLesson);

    // Get lessons by payment status
    console.log('Fetching pending payments...');
    const pendingLessons = await getLessonsByPaymentStatus('pending');
    console.log(`Found ${pendingLessons.length} lessons with pending payment`);

    // Delete a lesson (commented out for safety)
    // await deleteLesson(newLesson.lesson_id);
    // console.log('Lesson deleted');

  } catch (error) {
    console.error('Error in lesson operations:', error);
  }
}

/**
 * Example 3: Managing Recurring Lessons
 */
async function exampleRecurringLessonOperations() {
  try {
    // Get a student
    const students = await getStudents();
    if (students.length === 0) {
      console.log('No students found. Please add a student first.');
      return;
    }
    const studentId = students[0].student_id;

    // Add a recurring lesson (every Monday at 17:00)
    console.log('Adding recurring lesson...');
    const newRecurring = await addRecurringLesson({
      student_id: studentId,
      imera_evdomadas: 1, // Monday (0=Sunday, 1=Monday, etc.)
      ora_enarksis: '17:00',
      diarkeia_lepta: 45,
      timi: 25.00,
      enarxi_epanallipsis: '2025-09-01',
      lixi_epanallipsis: '2026-06-30'
    });
    console.log('Recurring lesson created:', newRecurring);

    // Get all recurring lessons
    console.log('Fetching all recurring lessons...');
    const recurringLessons = await getRecurringLessons();
    console.log(`Found ${recurringLessons.length} recurring lesson rules`);

    // Delete a recurring lesson (commented out for safety)
    // await deleteRecurringLesson(newRecurring.recurring_id);
    // console.log('Recurring lesson deleted');

  } catch (error) {
    console.error('Error in recurring lesson operations:', error);
  }
}

/**
 * Example 4: Complete workflow - Add student and schedule lessons
 */
async function exampleCompleteWorkflow() {
  try {
    // Step 1: Add a student
    console.log('Step 1: Adding new student...');
    const student = await addStudent({
      onoma_mathiti: 'Γιάννης',
      epitheto_mathiti: 'Κωνσταντίνου',
      etos_gennisis: 2014,
      onoma_gonea: 'Ελένη',
      epitheto_gonea: 'Κωνσταντίνου',
      kinhto_tilefono: '6987654321',
      email: 'eleni.konstantinou@example.com',
      megethos_violiou: '1/2',
      default_diarkeia: 40,
      default_timi: 20.00
    });
    console.log('Student created with ID:', student.student_id);

    // Step 2: Set up recurring weekly lesson (every Wednesday at 16:00)
    console.log('Step 2: Setting up recurring weekly lesson...');
    const recurring = await addRecurringLesson({
      student_id: student.student_id,
      imera_evdomadas: 3, // Wednesday
      ora_enarksis: '16:00',
      diarkeia_lepta: student.default_diarkeia,
      timi: student.default_timi,
      enarxi_epanallipsis: '2025-09-01',
      lixi_epanallipsis: '2026-06-30'
    });
    console.log('Recurring lesson set up:', recurring);

    // Step 3: Add specific lessons for October
    console.log('Step 3: Adding specific lessons for October 2025...');
    const octoberLessons = [
      new Date('2025-10-01T16:00:00'),
      new Date('2025-10-08T16:00:00'),
      new Date('2025-10-15T16:00:00'),
      new Date('2025-10-22T16:00:00'),
      new Date('2025-10-29T16:00:00')
    ];

    for (const lessonDate of octoberLessons) {
      const lesson = await addLesson({
        student_id: student.student_id,
        imera_ora_enarksis: lessonDate,
        diarkeia_lepta: student.default_diarkeia,
        timi: student.default_timi,
        katastasi_pliromis: 'pending'
      });
      console.log(`Lesson added for ${lessonDate.toLocaleDateString('el-GR')}`);
    }

    // Step 4: Mark first lesson as paid
    console.log('Step 4: Marking first lesson as paid...');
    const studentLessons = await getLessonsByStudent(student.student_id);
    if (studentLessons.length > 0) {
      await updateLessonPayment(studentLessons[0].lesson_id, 'paid');
      console.log('First lesson marked as paid');
    }

    // Step 5: Get summary
    console.log('Step 5: Getting summary...');
    const allLessons = await getLessonsByStudent(student.student_id);
    const paidLessons = allLessons.filter(l => l.katastasi_pliromis === 'paid');
    const pendingLessons = allLessons.filter(l => l.katastasi_pliromis === 'pending');
    
    console.log('\n=== Summary ===');
    console.log(`Student: ${student.onoma_mathiti} ${student.epitheto_mathiti}`);
    console.log(`Total lessons: ${allLessons.length}`);
    console.log(`Paid lessons: ${paidLessons.length}`);
    console.log(`Pending lessons: ${pendingLessons.length}`);
    console.log(`Total revenue: €${paidLessons.reduce((sum, l) => sum + parseFloat(l.timi), 0).toFixed(2)}`);
    console.log(`Pending revenue: €${pendingLessons.reduce((sum, l) => sum + parseFloat(l.timi), 0).toFixed(2)}`);

  } catch (error) {
    console.error('Error in complete workflow:', error);
  }
}

/**
 * Example 5: Calendar integration - Get lessons for a specific day
 */
async function exampleGetLessonsForDay(date) {
  try {
    // Set start to beginning of day and end to end of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    console.log(`Fetching lessons for ${date.toLocaleDateString('el-GR')}...`);
    const lessons = await getLessonsByDateRange(startDate, endDate);
    
    console.log(`\nLessons for ${date.toLocaleDateString('el-GR')}:`);
    if (lessons.length === 0) {
      console.log('No lessons scheduled');
    } else {
      lessons.forEach((lesson, index) => {
        const time = new Date(lesson.imera_ora_enarksis).toLocaleTimeString('el-GR', {
          hour: '2-digit',
          minute: '2-digit'
        });
        console.log(`${index + 1}. ${time} - ${lesson.students.onoma_mathiti} ${lesson.students.epitheto_mathiti} (${lesson.diarkeia_lepta} λεπτά, €${lesson.timi}) - ${lesson.katastasi_pliromis}`);
      });
    }

    return lessons;
  } catch (error) {
    console.error('Error getting lessons for day:', error);
  }
}

// Export functions for use in React components
export {
  exampleStudentOperations,
  exampleLessonOperations,
  exampleRecurringLessonOperations,
  exampleCompleteWorkflow,
  exampleGetLessonsForDay
};

// Example of how to use in a React component:
/*
import React, { useState, useEffect } from 'react';
import { getStudents, getLessonsByDateRange } from './supabaseService';

function MyComponent() {
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch students
        const studentsData = await getStudents();
        setStudents(studentsData);
        
        // Fetch lessons for current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const lessonsData = await getLessonsByDateRange(startOfMonth, endOfMonth);
        setLessons(lessonsData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Students: {students.length}</h2>
      <h2>Lessons this month: {lessons.length}</h2>
    </div>
  );
}

export default MyComponent;
*/
