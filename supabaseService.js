/**
 * Supabase Service Layer
 *
 * Περιλαμβάνει όλες τις συναρτήσεις που επικοινωνούν με το Supabase
 * και χρησιμεύουν ως ενιαίο επίπεδο πρόσβασης στις βάσεις δεδομένων
 * για την εφαρμογή "Διαχείριση Μαθημάτων".
 *
 * Σημείωση: οι συναρτήσεις επιστρέφουν αντικείμενα της μορφής
 * { success: boolean, data?, error? } για εύκολο χειρισμό από τα components.
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Οι μεταβλητές περιβάλλοντος πρέπει να οριστούν στο .env του έργου
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Authentication Functions
 */

/**
 * Sign in with email and password
 * - Καλείται από την οθόνη σύνδεσης για να λάβει session/user.
 * - Επιστρέφει { success: true, data } ή { success: false, error }.
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    // Καταγράφουμε το σφάλμα και επιστρέφουμε χρήσιμο μήνυμα
    console.error('Sign in error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out the current user
 * - Καλείται κατά το logout για να τερματίσει το session.
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get the current user session
 * - Επιστρέφει το session ή null σε περίπτωση σφάλματος.
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Get session error:', error.message);
    return null;
  }
};

/**
 * Student Management Functions
 *
 * Οι συναρτήσεις χειρίζονται CRUD για τον πίνακα students.
 * Επιστρέφουν πάντα αντικείμενα με πεδίο success για απλό έλεγχο.
 */

/**
 * Get all students
 * - Επιστρέφει λίστα μαθητών ταξινομημένη κατά επώνυμο.
 */
export const getStudents = async () => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('epitheto_mathiti', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get students error:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get a single student by ID
 * - Χρήσιμο όταν χρειαζόμαστε λεπτομέρειες ενός μαθητή.
 */
export const getStudentById = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get student error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Add a new student
 * - Εισάγει νέο record στον πίνακα students και επιστρέφει το δημιουργημένο αντικείμενο.
 */
export const addStudent = async (studentData) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Add student error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Update an existing student
 * - Ενημερώνει τα πεδία του μαθητή με το δοθέν studentId.
 */
export const updateStudent = async (studentId, studentData) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(studentData)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update student error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Delete a student
 * - Διαγράφει τον μαθητή. Προσοχή: η σχετική λογική cascade (μαθήματα κλπ.)
 *   πρέπει να διαχειρίζεται από το DB ή την εφαρμογή ανάλογα με το σχέδιο.
 */
export const deleteStudent = async (studentId) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('student_id', studentId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete student error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Lesson Management Functions
 *
 * CRUD και queries για τα μαθήματα, με embedded relation προς students.
 */

/**
 * Get lessons by date range
 * - Επιστρέφει μαθήματα εντός του διάστηματος μαζί με βασικά στοιχεία μαθητή.
 */
export const getLessonsByDateRange = async (startDate, endDate) => {
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
      .gte('imera_ora_enarksis', startDate)
      .lte('imera_ora_enarksis', endDate)
      .order('imera_ora_enarksis', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get lessons by date range error:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all lessons for a specific student
 * - Χρήσιμο για προφίλ μαθητή ή ιστορικό.
 */
export const getLessonsByStudent = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('student_id', studentId)
      .order('imera_ora_enarksis', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get lessons by student error:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Add a new lesson
 * - Δημιουργεί ένα νέο μάθημα. Το lessonData πρέπει να περιέχει student_id και imera_ora_enarksis.
 */
export const addLesson = async (lessonData) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .insert([lessonData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Add lesson error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Update a lesson
 * - Ενημερώνει πεδία συγκεκριμένου μαθήματος.
 */
export const updateLesson = async (lessonId, lessonData) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .update(lessonData)
      .eq('lesson_id', lessonId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update lesson error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Update lesson payment status
 * - Αλλάζει την κατάσταση πληρωμής (paid/pending/cancelled).
 */
export const updateLessonPayment = async (lessonId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .update({ katastasi_pliromis: newStatus })
      .eq('lesson_id', lessonId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update lesson payment error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Delete a lesson
 * - Διαγράφει το lesson με το δοθέν lessonId.
 */
export const deleteLesson = async (lessonId) => {
  try {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('lesson_id', lessonId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete lesson error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Recurring Lesson Management Functions
 * - CRUD για τους κανόνες επανάληψης (recurring_lessons)
 */

/**
 * Get all recurring lessons
 * - Επιστρέφει κανόνες με relation στο students για εμφάνιση ονομάτων.
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
          kinhto_tilefono
        )
      `)
      .order('imera_evdomadas', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get recurring lessons error:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get recurring lessons for a specific student
 */
export const getRecurringLessonsByStudent = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('recurring_lessons')
      .select('*')
      .eq('student_id', studentId)
      .order('imera_evdomadas', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get recurring lessons by student error:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Add a new recurring lesson rule
 */
export const addRecurringLesson = async (recurringData) => {
  try {
    const { data, error } = await supabase
      .from('recurring_lessons')
      .insert([recurringData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Add recurring lesson error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Update a recurring lesson rule
 */
export const updateRecurringLesson = async (recurringId, recurringData) => {
  try {
    const { data, error } = await supabase
      .from('recurring_lessons')
      .update(recurringData)
      .eq('recurring_id', recurringId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update recurring lesson error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Delete a recurring lesson rule
 */
export const deleteRecurringLesson = async (recurringId) => {
  try {
    const { error } = await supabase
      .from('recurring_lessons')
      .delete()
      .eq('recurring_id', recurringId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete recurring lesson error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Utility Functions
 */

/**
 * Get payment statistics for a date range
 * - Υπολογίζει συνολικά μαθήματα, ποσά ανά κατάσταση και αθροίσματα.
 */
export const getPaymentStatistics = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('katastasi_pliromis, timi')
      .gte('imera_ora_enarksis', startDate)
      .lte('imera_ora_enarksis', endDate);

    if (error) throw error;

    // Initialize stats
    const stats = {
      total: 0,
      paid: 0,
      pending: 0,
      cancelled: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
    };

    data.forEach(lesson => {
      stats.total++;
      const amount = parseFloat(lesson.timi) || 0;
      stats.totalAmount += amount;

      switch (lesson.katastasi_pliromis) {
        case 'paid':
          stats.paid++;
          stats.paidAmount += amount;
          break;
        case 'pending':
          stats.pending++;
          stats.pendingAmount += amount;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('Get payment statistics error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Generate individual lessons from recurring rules for a date range
 * - Βοηθητική συνάρτηση που χρησιμοποιείται για μαζική δημιουργία μαθημάτων
 *   από έναν κανόνα επανάληψης. Εισάγει όλα τα παραγόμενα lessons με ένα insert.
 */
export const generateLessonsFromRecurring = async (recurringId, startDate, endDate) => {
  try {
    // First, get the recurring lesson rule
    const { data: recurringLesson, error: fetchError } = await supabase
      .from('recurring_lessons')
      .select('*')
      .eq('recurring_id', recurringId)
      .single();

    if (fetchError) throw fetchError;

    // Generate lesson dates based on the rule
    const lessons = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const ruleStart = new Date(recurringLesson.enarxi_epanallipsis);
    const ruleEnd = recurringLesson.lixi_epanallipsis ? new Date(recurringLesson.lixi_epanallipsis) : end;

    let currentDate = new Date(Math.max(start, ruleStart));

    // Find the first occurrence of the target day of week
    while (currentDate.getDay() !== recurringLesson.imera_evdomadas && currentDate <= end) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Generate lessons for each occurrence
    while (currentDate <= Math.min(end, ruleEnd)) {
      const [hours, minutes] = recurringLesson.ora_enarksis.split(':');
      const lessonDateTime = new Date(currentDate);
      lessonDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      lessons.push({
        student_id: recurringLesson.student_id,
        imera_ora_enarksis: lessonDateTime.toISOString(),
        diarkeia_lepta: recurringLesson.diarkeia_lepta,
        timi: recurringLesson.timi,
        katastasi_pliromis: 'pending',
      });

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Insert all generated lessons
    if (lessons.length > 0) {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessons)
        .select();

      if (error) throw error;
      return { success: true, data, count: lessons.length };
    }

    return { success: true, data: [], count: 0 };
  } catch (error) {
    console.error('Generate lessons from recurring error:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Student Progress Tracking Functions
 * - CRUD για την παρακολούθηση προόδου μαθητών.
 */

/**
 * Get progress entries for a specific student
 */
export const getStudentProgress = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId)
      .order('imera_kataxorisis', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get student progress error:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Add a progress entry for a student
 */
export const addStudentProgress = async (progressData) => {
  try {
    const { data, error } = await supabase
      .from('student_progress')
      .insert([progressData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Add student progress error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Update a progress entry
 */
export const updateStudentProgress = async (progressId, progressData) => {
  try {
    const { data, error } = await supabase
      .from('student_progress')
      .update(progressData)
      .eq('progress_id', progressId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update student progress error:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Delete a progress entry
 */
export const deleteStudentProgress = async (progressId) => {
  try {
    const { error } = await supabase
      .from('student_progress')
      .delete()
      .eq('progress_id', progressId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete student progress error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Default export: παρέχει όλες τις λειτουργίες ως αντικείμενο
 */
export default {
  supabase,
  signIn,
  signOut,
  getCurrentSession,
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getLessonsByDateRange,
  getLessonsByStudent,
  addLesson,
  updateLesson,
  updateLessonPayment,
  deleteLesson,
  getRecurringLessons,
  getRecurringLessonsByStudent,
  addRecurringLesson,
  updateRecurringLesson,
  deleteRecurringLesson,
  getPaymentStatistics,
  generateLessonsFromRecurring,
  getStudentProgress,
  addStudentProgress,
  updateStudentProgress,
  deleteStudentProgress,
};
