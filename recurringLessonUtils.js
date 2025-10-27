/**
 * Utility functions for generating lessons from recurring rules
 */

import { getRecurringLessons, addLesson, getLessonsByDateRange } from './supabaseService';

/**
 * Generate lessons from all active recurring rules for a date range
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise<Object>} Result with count of generated lessons
 */
export const generateLessonsFromAllRecurring = async (startDate, endDate) => {
  try {
    // Παίρνουμε όλους τους κανόνες επανάληψης από το backend
    const recurringResult = await getRecurringLessons();
    if (!recurringResult.success) {
      // Επιστρέφουμε σφάλμα αν δεν φορτώθηκαν οι κανόνες
      return { success: false, error: 'Failed to fetch recurring lessons', count: 0 };
    }

    const recurringLessons = recurringResult.data;
    let totalGenerated = 0;
    const errors = [];

    // Παίρνουμε υπάρχοντα μαθήματα στο διάστημα για να αποφύγουμε διπλότυπα
    const existingLessonsResult = await getLessonsByDateRange(startDate, endDate);
    const existingLessons = existingLessonsResult.success ? existingLessonsResult.data : [];

    // Για κάθε κανόνα επανάληψης δημιουργούμε τα απαραίτητα μαθήματα
    for (const recurring of recurringLessons) {
      try {
        const generated = await generateLessonsFromRule(
          recurring,
          startDate,
          endDate,
          existingLessons
        );
        totalGenerated += generated;
      } catch (error) {
        // Καταγραφή σφαλμάτων ανά κανόνα για αναφορά στον χρήστη
        errors.push(`Error with recurring lesson ${recurring.recurring_id}: ${error.message}`);
      }
    }

    return {
      success: true,
      count: totalGenerated,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error) {
    // Γενικό catch για απρόβλεπτα σφάλματα
    console.error('Generate lessons from recurring error:', error);
    return { success: false, error: error.message, count: 0 };
  }
};

/**
 * Generate lessons from a single recurring rule
 * @param {Object} recurringLesson - Recurring lesson rule
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @param {Array} existingLessons - Existing lessons to avoid duplicates
 * @returns {Promise<number>} Count of generated lessons
 */
const generateLessonsFromRule = async (recurringLesson, startDate, endDate, existingLessons = []) => {
  // Μετατροπή των ημερομηνιών σε αντικείμενα Date για εύκολους χειρισμούς
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ruleStart = new Date(recurringLesson.enarxi_epanallipsis);
  const ruleEnd = recurringLesson.lixi_epanallipsis
    ? new Date(recurringLesson.lixi_epanallipsis)
    : end;

  // Ξεκινάμε από την μεγαλύτερη ημερομηνία μεταξύ του range και της έναρξης του κανόνα
  let currentDate = new Date(Math.max(start.getTime(), ruleStart.getTime()));

  // Βρίσκουμε την πρώτη ημέρα που αντιστοιχεί στην ημέρα της εβδομάδας του κανόνα
  while (currentDate.getDay() !== recurringLesson.imera_evdomadas && currentDate <= end) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const lessonsToCreate = [];

  // Για κάθε επόμενη εμφάνιση (προστίθεται 7 ημέρες για εβδομαδιαία επανάληψη)
  while (currentDate.getTime() <= Math.min(end.getTime(), ruleEnd.getTime())) {
    // Παίρνουμε ώρες/λεπτά από το πεδίο ora_enarksis (μορφή "HH:MM")
    const [hours, minutes] = recurringLesson.ora_enarksis.split(':');
    const lessonDateTime = new Date(currentDate);
    lessonDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Έλεγχος για διπλότυπα: ίδιος μαθητής και ίδια ακριβώς ώρα
    const isDuplicate = existingLessons.some((existing) => {
      const existingDate = new Date(existing.imera_ora_enarksis);
      return (
        existing.student_id === recurringLesson.student_id &&
        existingDate.getTime() === lessonDateTime.getTime()
      );
    });

    if (!isDuplicate) {
      // Προετοιμάζουμε τα δεδομένα του μαθήματος για δημιουργία
      lessonsToCreate.push({
        student_id: recurringLesson.student_id,
        imera_ora_enarksis: lessonDateTime.toISOString(),
        diarkeia_lepta: recurringLesson.diarkeia_lepta,
        timi: recurringLesson.timi,
        katastasi_pliromis: 'pending', // προεπιλογή κατάστασης
      });
    }

    // Πηγαίνουμε στην επόμενη εβδομάδα
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Εισάγουμε τα μαθήματα ένα-ένα στο backend
  let createdCount = 0;
  for (const lessonData of lessonsToCreate) {
    const result = await addLesson(lessonData);
    if (result.success) {
      createdCount++;
    } else {
      // Σε περίπτωση αποτυχίας μπορούμε να καταγράψουμε ή να χειριστούμε το σφάλμα
      console.warn('Failed to create lesson from recurring rule:', result.error);
    }
  }

  return createdCount;
};

/**
 * Generate lessons for the next N days from all recurring rules
 * @param {number} days - Number of days to generate lessons for
 * @returns {Promise<Object>} Result with count of generated lessons
 */
export const generateUpcomingLessons = async (days = 30) => {
  // Ορίζουμε το διάστημα από σήμερα έως τις επόμενες N ημέρες
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return generateLessonsFromAllRecurring(startDate.toISOString(), endDate.toISOString());
};

export default {
  generateLessonsFromAllRecurring,
  generateUpcomingLessons,
};
