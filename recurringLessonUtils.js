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
    // Get all recurring lesson rules
    const recurringResult = await getRecurringLessons();
    if (!recurringResult.success) {
      return { success: false, error: 'Failed to fetch recurring lessons', count: 0 };
    }

    const recurringLessons = recurringResult.data;
    let totalGenerated = 0;
    const errors = [];

    // Get existing lessons to avoid duplicates
    const existingLessonsResult = await getLessonsByDateRange(startDate, endDate);
    const existingLessons = existingLessonsResult.success ? existingLessonsResult.data : [];

    // For each recurring rule, generate lessons
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
        errors.push(`Error with recurring lesson ${recurring.recurring_id}: ${error.message}`);
      }
    }

    return {
      success: true,
      count: totalGenerated,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error) {
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
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ruleStart = new Date(recurringLesson.enarxi_epanallipsis);
  const ruleEnd = recurringLesson.lixi_epanallipsis
    ? new Date(recurringLesson.lixi_epanallipsis)
    : end;

  let currentDate = new Date(Math.max(start.getTime(), ruleStart.getTime()));

  // Find the first occurrence of the target day of week
  while (currentDate.getDay() !== recurringLesson.imera_evdomadas && currentDate <= end) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const lessonsToCreate = [];

  // Generate lessons for each occurrence
  while (currentDate.getTime() <= Math.min(end.getTime(), ruleEnd.getTime())) {
    const [hours, minutes] = recurringLesson.ora_enarksis.split(':');
    const lessonDateTime = new Date(currentDate);
    lessonDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if a lesson already exists at this time for this student
    const isDuplicate = existingLessons.some((existing) => {
      const existingDate = new Date(existing.imera_ora_enarksis);
      return (
        existing.student_id === recurringLesson.student_id &&
        existingDate.getTime() === lessonDateTime.getTime()
      );
    });

    if (!isDuplicate) {
      lessonsToCreate.push({
        student_id: recurringLesson.student_id,
        imera_ora_enarksis: lessonDateTime.toISOString(),
        diarkeia_lepta: recurringLesson.diarkeia_lepta,
        timi: recurringLesson.timi,
        katastasi_pliromis: 'pending',
      });
    }

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Insert all generated lessons
  let createdCount = 0;
  for (const lessonData of lessonsToCreate) {
    const result = await addLesson(lessonData);
    if (result.success) {
      createdCount++;
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
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return generateLessonsFromAllRecurring(startDate.toISOString(), endDate.toISOString());
};

export default {
  generateLessonsFromAllRecurring,
  generateUpcomingLessons,
};
