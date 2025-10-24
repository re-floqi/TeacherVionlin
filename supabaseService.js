/**
 * Supabase Service Module
 * 
 * This module provides JavaScript functions to interact with the Supabase backend
 * for the Teacher Violin Lesson Tracking Application.
 * 
 * Before using this module, ensure you have:
 * 1. Created a Supabase project
 * 2. Run the SQL schema from supabase-schema.sql
 * 3. Set up environment variables with your Supabase URL and API key
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Replace these with your actual Supabase project URL and anon key
// In production, use environment variables:
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch all students from the database
 * @returns {Promise<Array>} Array of student objects
 */
export const getStudents = async () => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in getStudents:', error);
    throw error;
  }
};

/**
 * Add a new student to the database
 * @param {Object} studentData - Student information
 * @param {string} studentData.onoma_mathiti - Student's first name (required)
 * @param {string} studentData.epitheto_mathiti - Student's last name
 * @param {number} studentData.etos_gennisis - Birth year
 * @param {string} studentData.onoma_gonea - Parent's first name
 * @param {string} studentData.epitheto_gonea - Parent's last name
 * @param {string} studentData.kinhto_tilefono - Mobile phone (required)
 * @param {string} studentData.email - Email address
 * @param {string} studentData.megethos_violiou - Violin size (e.g., "4/4")
 * @param {number} studentData.default_diarkeia - Default lesson duration in minutes
 * @param {number} studentData.default_timi - Default lesson price
 * @param {string} studentData.simiwseis - Notes
 * @returns {Promise<Object>} The created student object
 */
export const addStudent = async (studentData) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();

    if (error) {
      console.error('Error adding student:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in addStudent:', error);
    throw error;
  }
};

/**
 * Fetch lessons within a specific date range
 * @param {string|Date} startDate - Start date for the range
 * @param {string|Date} endDate - End date for the range
 * @returns {Promise<Array>} Array of lesson objects with student information
 */
export const getLessonsByDateRange = async (startDate, endDate) => {
  try {
    // Convert dates to ISO string format if they are Date objects
    const start = startDate instanceof Date ? startDate.toISOString() : startDate;
    const end = endDate instanceof Date ? endDate.toISOString() : endDate;

    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        students (
          student_id,
          onoma_mathiti,
          epitheto_mathiti,
          kinhto_tilefono,
          megethos_violiou
        )
      `)
      .gte('imera_ora_enarksis', start)
      .lte('imera_ora_enarksis', end)
      .order('imera_ora_enarksis', { ascending: true });

    if (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in getLessonsByDateRange:', error);
    throw error;
  }
};

/**
 * Add a new lesson to the database
 * @param {Object} lessonData - Lesson information
 * @param {number} lessonData.student_id - Student ID (required)
 * @param {string|Date} lessonData.imera_ora_enarksis - Lesson start date and time (required)
 * @param {number} lessonData.diarkeia_lepta - Lesson duration in minutes (required)
 * @param {number} lessonData.timi - Lesson price (required)
 * @param {string} lessonData.katastasi_pliromis - Payment status ('pending', 'paid', 'cancelled')
 * @param {string} lessonData.simiwseis_mathimatos - Lesson notes
 * @returns {Promise<Object>} The created lesson object
 */
export const addLesson = async (lessonData) => {
  try {
    // Convert date to ISO string format if it's a Date object
    const lessonDataToInsert = {
      ...lessonData,
      imera_ora_enarksis: lessonData.imera_ora_enarksis instanceof Date 
        ? lessonData.imera_ora_enarksis.toISOString() 
        : lessonData.imera_ora_enarksis
    };

    const { data, error } = await supabase
      .from('lessons')
      .insert([lessonDataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error adding lesson:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in addLesson:', error);
    throw error;
  }
};

/**
 * Update the payment status of a lesson
 * @param {number} lessonId - The ID of the lesson to update
 * @param {string} newStatus - New payment status ('pending', 'paid', 'cancelled')
 * @returns {Promise<Object>} The updated lesson object
 */
export const updateLessonPayment = async (lessonId, newStatus) => {
  try {
    // Validate status
    const validStatuses = ['pending', 'paid', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid payment status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('lessons')
      .update({ katastasi_pliromis: newStatus })
      .eq('lesson_id', lessonId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lesson payment:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in updateLessonPayment:', error);
    throw error;
  }
};

/**
 * Fetch all recurring lesson rules from the database
 * @returns {Promise<Array>} Array of recurring lesson objects with student information
 */
export const getRecurringLessons = async () => {
  try {
    const { data, error } = await supabase
      .from('recurring_lessons')
      .select(`
        *,
        students (
          student_id,
          onoma_mathiti,
          epitheto_mathiti,
          kinhto_tilefono,
          megethos_violiou
        )
      `)
      .order('imera_evdomadas', { ascending: true })
      .order('ora_enarksis', { ascending: true });

    if (error) {
      console.error('Error fetching recurring lessons:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in getRecurringLessons:', error);
    throw error;
  }
};

/**
 * Delete a student from the database
 * Note: This will cascade delete all associated lessons and recurring lessons
 * @param {number} studentId - The ID of the student to delete
 * @returns {Promise<void>}
 */
export const deleteStudent = async (studentId) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('student_id', studentId);

    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }

    return { success: true, message: 'Student deleted successfully' };
  } catch (error) {
    console.error('Exception in deleteStudent:', error);
    throw error;
  }
};

/**
 * Delete a lesson from the database
 * @param {number} lessonId - The ID of the lesson to delete
 * @returns {Promise<void>}
 */
export const deleteLesson = async (lessonId) => {
  try {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('lesson_id', lessonId);

    if (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }

    return { success: true, message: 'Lesson deleted successfully' };
  } catch (error) {
    console.error('Exception in deleteLesson:', error);
    throw error;
  }
};

/**
 * Additional helper functions
 */

/**
 * Get a single student by ID
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Object>} Student object
 */
export const getStudentById = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error) {
      console.error('Error fetching student:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in getStudentById:', error);
    throw error;
  }
};

/**
 * Update student information
 * @param {number} studentId - The ID of the student to update
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Object>} The updated student object
 */
export const updateStudent = async (studentId, updates) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in updateStudent:', error);
    throw error;
  }
};

/**
 * Add a recurring lesson rule
 * @param {Object} recurringData - Recurring lesson information
 * @param {number} recurringData.student_id - Student ID (required)
 * @param {number} recurringData.imera_evdomadas - Day of week (0-6, 0=Sunday) (required)
 * @param {string} recurringData.ora_enarksis - Start time (e.g., "17:00") (required)
 * @param {number} recurringData.diarkeia_lepta - Duration in minutes (required)
 * @param {number} recurringData.timi - Price (required)
 * @param {string|Date} recurringData.enarxi_epanallipsis - Start date (required)
 * @param {string|Date} recurringData.lixi_epanallipsis - End date
 * @returns {Promise<Object>} The created recurring lesson object
 */
export const addRecurringLesson = async (recurringData) => {
  try {
    const { data, error } = await supabase
      .from('recurring_lessons')
      .insert([recurringData])
      .select()
      .single();

    if (error) {
      console.error('Error adding recurring lesson:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in addRecurringLesson:', error);
    throw error;
  }
};

/**
 * Delete a recurring lesson rule
 * @param {number} recurringId - The ID of the recurring lesson to delete
 * @returns {Promise<void>}
 */
export const deleteRecurringLesson = async (recurringId) => {
  try {
    const { error } = await supabase
      .from('recurring_lessons')
      .delete()
      .eq('recurring_id', recurringId);

    if (error) {
      console.error('Error deleting recurring lesson:', error);
      throw error;
    }

    return { success: true, message: 'Recurring lesson deleted successfully' };
  } catch (error) {
    console.error('Exception in deleteRecurringLesson:', error);
    throw error;
  }
};

/**
 * Get lessons for a specific student
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} Array of lesson objects
 */
export const getLessonsByStudent = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('student_id', studentId)
      .order('imera_ora_enarksis', { ascending: false });

    if (error) {
      console.error('Error fetching student lessons:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in getLessonsByStudent:', error);
    throw error;
  }
};

/**
 * Get lessons by payment status
 * @param {string} status - Payment status ('pending', 'paid', 'cancelled')
 * @returns {Promise<Array>} Array of lesson objects
 */
export const getLessonsByPaymentStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        students (
          student_id,
          onoma_mathiti,
          epitheto_mathiti,
          kinhto_tilefono
        )
      `)
      .eq('katastasi_pliromis', status)
      .order('imera_ora_enarksis', { ascending: true });

    if (error) {
      console.error('Error fetching lessons by payment status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in getLessonsByPaymentStatus:', error);
    throw error;
  }
};

export default {
  supabase,
  getStudents,
  addStudent,
  getLessonsByDateRange,
  addLesson,
  updateLessonPayment,
  getRecurringLessons,
  deleteStudent,
  deleteLesson,
  getStudentById,
  updateStudent,
  addRecurringLesson,
  deleteRecurringLesson,
  getLessonsByStudent,
  getLessonsByPaymentStatus
};
