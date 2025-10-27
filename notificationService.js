/**
 * Push Notifications Service
 * 
 * This module handles push notifications for upcoming lessons and payment reminders.
 * Note: Requires expo-notifications to be installed and configured.
 * Run: expo install expo-notifications
 *
 * Σχόλια (GR):
 * - Αυτό το αρχείο προσφέρει helpers για την αίτηση αδειών, τον προγραμματισμό
 *   ειδοποιήσεων για επερχόμενα μαθήματα και υπενθυμίσεις πληρωμών.
 * - Χρησιμοποιεί το API του expo-notifications και πρέπει να λειτουργεί σε
 *   περιβάλλον Expo / React Native με σωστή ρύθμιση.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
// Ορίζουμε πώς θα εμφανίζονται οι ειδοποιήσεις όταν η εφαρμογή είναι foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   // Εμφάνιση alert
    shouldPlaySound: true,   // Αναπαραγωγή ήχου
    shouldSetBadge: true,    // Ενημέρωση badge (iOS)
  }),
});

/**
 * Request notification permissions
 * @returns {Promise<boolean>} Whether permissions were granted
 *
 * Περιγραφή:
 * - Ελέγχει την τρέχουσα κατάσταση αδειών και, αν χρειάζεται, ζητάει άδεια.
 * - Σε Android δημιουργεί κανάλι ειδοποιήσεων με ρυθμίσεις για vibration/light.
 * - Επιστρέφει true αν οι άδειες δόθηκαν, αλλιώς false.
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Ζητάμε δικαιώματα αν δεν έχουν ήδη δοθεί
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // For Android, create a notification channel
    // Στο Android χρειάζεται κανάλι για να εμφανίζονται σωστά οι ειδοποιήσεις
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('lessons', {
        name: 'Lessons',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#5e72e4',
      });
    }

    return true;
  } catch (error) {
    // Καταγραφή σφάλματος χωρίς να σπάει η ροή της εφαρμογής
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a notification for an upcoming lesson
 * @param {Object} lesson - Lesson object with details
 * @param {number} minutesBefore - Minutes before lesson to send notification
 * @returns {Promise<string|null>} Notification ID or null if failed
 *
 * Περιγραφή:
 * - Προγραμματίζει ειδοποίηση X λεπτά πριν το μάθημα.
 * - Αγνοεί την αιτηση αν η ώρα ειδοποίησης έχει ήδη περάσει.
 * - Επιστρέφει το notificationId αν προγραμματίστηκε επιτυχώς, αλλιώς null.
 */
export const scheduleUpcomingLessonNotification = async (lesson, minutesBefore = 60) => {
  try {
    const lessonDate = new Date(lesson.imera_ora_enarksis);
    const notificationDate = new Date(lessonDate.getTime() - minutesBefore * 60 * 1000);
    
    // Don't schedule if the notification time has already passed
    if (notificationDate <= new Date()) {
      return null;
    }

    // Χτίζουμε όνομα μαθητή για εμφανιζόμενο κείμενο (fallback αν λείπουν πεδία)
    const studentName = lesson.students
      ? `${lesson.students.onoma_mathiti} ${lesson.students.epitheto_mathiti || ''}`
      : 'Μαθητής';

    // Προγραμματισμός ειδοποίησης με συγκεκριμένο trigger (ημερομηνία)
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎻 Επερχόμενο μάθημα',
        body: `Μάθημα με ${studentName} σε ${minutesBefore} λεπτά (${lessonDate.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })})`,
        data: { lessonId: lesson.lesson_id, type: 'upcoming_lesson' },
        sound: true,
      },
      trigger: notificationDate,
    });

    return notificationId;
  } catch (error) {
    // Καταγραφή και επιστροφή null σε αποτυχία
    console.error('Error scheduling lesson notification:', error);
    return null;
  }
};

/**
 * Schedule notifications for multiple lessons
 * @param {Array} lessons - Array of lesson objects
 * @param {number} minutesBefore - Minutes before each lesson to send notification
 * @returns {Promise<Array>} Array of notification IDs
 *
 * Περιγραφή:
 * - Βασίζεται στην scheduleUpcomingLessonNotification για κάθε μάθημα.
 * - Επιστρέφει τον πίνακα με τα IDs των ειδοποιήσεων που προγραμματίστηκαν.
 */
export const scheduleMultipleLessonNotifications = async (lessons, minutesBefore = 60) => {
  const notificationIds = [];
  
  for (const lesson of lessons) {
    const id = await scheduleUpcomingLessonNotification(lesson, minutesBefore);
    if (id) {
      notificationIds.push(id);
    }
  }
  
  return notificationIds;
};

/**
 * Schedule a payment reminder notification
 * @param {Object} lesson - Lesson object with pending payment
 * @returns {Promise<string|null>} Notification ID or null if failed
 *
 * Περιγραφή:
 * - Δημιουργεί υπενθύμιση πληρωμής 1 μέρα μετά το μάθημα (σύμφωνα με την τρέχουσα υλοποίηση).
 * - Αγνοεί αν η ώρα υπενθύμισης έχει περάσει.
 */
export const schedulePaymentReminder = async (lesson) => {
  try {
    const lessonDate = new Date(lesson.imera_ora_enarksis);
    const reminderDate = new Date(lessonDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after lesson
    
    // Don't schedule if the reminder time has already passed
    if (reminderDate <= new Date()) {
      return null;
    }

    const studentName = lesson.students
      ? `${lesson.students.onoma_mathiti} ${lesson.students.epitheto_mathiti || ''}`
      : 'Μαθητής';

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💶 Υπενθύμιση πληρωμής',
        body: `Εκκρεμεί πληρωμή ${lesson.timi}€ από ${studentName}`,
        data: { lessonId: lesson.lesson_id, type: 'payment_reminder' },
        sound: true,
      },
      trigger: reminderDate,
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling payment reminder:', error);
    return null;
  }
};

/**
 * Schedule payment reminders for pending lessons
 * @param {Array} lessons - Array of lessons with pending payments
 * @returns {Promise<Array>} Array of notification IDs
 *
 * Περιγραφή:
 * - Φιλτράρει τα μαθήματα με κατάσταση 'pending' και καλεί schedulePaymentReminder.
 * - Επιστρέφει τα IDs των προγραμματισμένων υπενθυμίσεων.
 */
export const schedulePaymentReminders = async (lessons) => {
  const notificationIds = [];
  
  const pendingLessons = lessons.filter(
    lesson => lesson.katastasi_pliromis === 'pending'
  );
  
  for (const lesson of pendingLessons) {
    const id = await schedulePaymentReminder(lesson);
    if
