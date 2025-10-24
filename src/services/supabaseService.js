import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getStudents = async () => {
    const { data, error } = await supabase
        .from('students')
        .select('*');
    if (error) throw error;
    return data;
};

export const addStudent = async (studentData) => {
    const { data, error } = await supabase
        .from('students')
        .insert([studentData]);
    if (error) throw error;
    return data;
};

export const getLessonsByDateRange = async (startDate, endDate) => {
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);
    if (error) throw error;
    return data;
};

export const addLesson = async (lessonData) => {
    const { data, error } = await supabase
        .from('lessons')
        .insert([lessonData]);
    if (error) throw error;
    return data;
};

export const updateLessonPayment = async (lessonId, newStatus) => {
    const { data, error } = await supabase
        .from('lessons')
        .update({ payment_status: newStatus })
        .eq('id', lessonId);
    if (error) throw error;
    return data;
};

export const getRecurringLessons = async () => {
    const { data, error } = await supabase
        .from('recurring_lessons')
        .select('*');
    if (error) throw error;
    return data;
};

export const deleteStudent = async (studentId) => {
    const { data, error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
    if (error) throw error;
    return data;
};

export const deleteLesson = async (lessonId) => {
    const { data, error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);
    if (error) throw error;
    return data;
};