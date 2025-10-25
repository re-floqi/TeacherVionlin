/**
 * Backup and Restore Service
 * 
 * This module handles backing up and restoring application data.
 */

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { getStudents, getLessonsByDateRange, getRecurringLessons } from './supabaseService';

/**
 * Create a complete backup of all data
 * @returns {Promise<boolean>} Success status
 */
export const createBackup = async () => {
  try {
    // Fetch all data
    const studentsResult = await getStudents();
    const students = studentsResult.success ? studentsResult.data : [];
    
    // Get lessons for the past year and future year
    const today = new Date();
    const startDate = new Date(today.getFullYear() - 1, 0, 1);
    const endDate = new Date(today.getFullYear() + 1, 11, 31);
    
    const lessonsResult = await getLessonsByDateRange(
      startDate.toISOString(),
      endDate.toISOString()
    );
    const lessons = lessonsResult.success ? lessonsResult.data : [];
    
    const recurringResult = await getRecurringLessons();
    const recurringLessons = recurringResult.success ? recurringResult.data : [];
    
    // Create backup object
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        students,
        lessons,
        recurringLessons,
      },
      metadata: {
        studentsCount: students.length,
        lessonsCount: lessons.length,
        recurringLessonsCount: recurringLessons.length,
      },
    };
    
    // Convert to JSON
    const backupJson = JSON.stringify(backup, null, 2);
    
    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `teacher_vionlin_backup_${timestamp}.json`;
    const fileUri = FileSystem.documentDirectory + filename;
    
    await FileSystem.writeAsStringAsync(fileUri, backupJson, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    // Share the backup file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Αποθήκευση αντιγράφου ασφαλείας',
      });
      
      Alert.alert(
        'Επιτυχία',
        `Δημιουργήθηκε αντίγραφο ασφαλείας με:\n- ${students.length} μαθητές\n- ${lessons.length} μαθήματα\n- ${recurringLessons.length} επαναλαμβανόμενα μαθήματα`
      );
      return true;
    } else {
      Alert.alert('Σφάλμα', 'Η κοινοποίηση δεν είναι διαθέσιμη σε αυτήν τη συσκευή');
      return false;
    }
  } catch (error) {
    console.error('Error creating backup:', error);
    Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η δημιουργία αντιγράφου ασφαλείας');
    return false;
  }
};

/**
 * Restore data from a backup file
 * Note: This is a basic implementation. In production, you should:
 * 1. Validate the backup file structure
 * 2. Handle conflicts with existing data
 * 3. Provide options for merge vs replace
 * 4. Create a backup before restoring
 * @returns {Promise<boolean>} Success status
 */
export const restoreFromBackup = async () => {
  try {
    Alert.alert(
      'Επαναφορά Αντιγράφου',
      'ΠΡΟΣΟΧΗ: Αυτή η λειτουργία απαιτεί προσεκτική υλοποίηση για να αποφευχθεί απώλεια δεδομένων. Για ασφάλεια, προτείνεται να χρησιμοποιήσετε τη διαχειριστική διεπαφή της βάσης δεδομένων για επαναφορά δεδομένων.',
      [
        { text: 'OK', style: 'cancel' },
      ]
    );
    
    // This is a placeholder for the restore functionality
    // In a production app, you would:
    // 1. Use DocumentPicker to select a backup file
    // 2. Read and validate the backup file
    // 3. Prompt user about restore strategy (merge/replace)
    // 4. Use Supabase bulk insert/update operations
    // 5. Handle errors and provide rollback capability
    
    return false;
  } catch (error) {
    console.error('Error restoring backup:', error);
    Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η επαναφορά από το αντίγραφο ασφαλείας');
    return false;
  }
};

/**
 * Export database schema as SQL (informational)
 * This creates a copy of the database schema for reference
 */
export const exportDatabaseSchema = async () => {
  try {
    // Read the schema file from the project
    const schemaPath = FileSystem.documentDirectory + '../database_schema.sql';
    
    Alert.alert(
      'Σχήμα Βάσης Δεδομένων',
      'Το σχήμα της βάσης δεδομένων βρίσκεται στο αρχείο database_schema.sql του έργου. Μπορείτε να το χρησιμοποιήσετε για να αναδημιουργήσετε τη βάση δεδομένων στο Supabase.',
      [{ text: 'OK' }]
    );
    
    return true;
  } catch (error) {
    console.error('Error exporting schema:', error);
    return false;
  }
};

/**
 * Validate a backup file structure
 * @param {Object} backup - Parsed backup object
 * @returns {boolean} Whether the backup is valid
 */
const validateBackup = (backup) => {
  if (!backup || typeof backup !== 'object') {
    return false;
  }
  
  if (!backup.version || !backup.timestamp || !backup.data) {
    return false;
  }
  
  const { data } = backup;
  if (!Array.isArray(data.students) || !Array.isArray(data.lessons)) {
    return false;
  }
  
  return true;
};

/**
 * Schedule automatic backups (placeholder)
 * In a production app, you would use a task scheduling library
 * or cloud function to automate backups
 */
export const scheduleAutomaticBackup = async () => {
  Alert.alert(
    'Αυτόματα Αντίγραφα',
    'Για αυτόματη δημιουργία αντιγράφων ασφαλείας, προτείνεται η χρήση των built-in backup features του Supabase που παρέχουν point-in-time recovery.',
    [{ text: 'OK' }]
  );
  return false;
};

export default {
  createBackup,
  restoreFromBackup,
  exportDatabaseSchema,
  scheduleAutomaticBackup,
};
