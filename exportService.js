/**
 * Data Export Service
 * 
 * This module handles exporting lesson and payment data to various formats.
 * Note: For production use, consider adding libraries:
 * - Excel: expo install react-native-table-component or use a web-based approach
 * - PDF: expo install react-native-pdf or use expo-print for PDF generation
 */

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Export lessons data to CSV format
 * @param {Array} lessons - Array of lesson objects
 * @param {string} filename - Name of the file to export
 * @returns {Promise<boolean>} Success status
 */
export const exportLessonsToCSV = async (lessons, filename = 'lessons.csv') => {
  try {
    // Create CSV header
    const header = 'Ημερομηνία,Ώρα,Μαθητής,Διάρκεια (λεπτά),Τιμή (€),Κατάσταση Πληρωμής,Σημειώσεις\n';
    
    // Create CSV rows
    const rows = lessons.map(lesson => {
      const date = new Date(lesson.imera_ora_enarksis);
      const dateStr = date.toLocaleDateString('el-GR');
      const timeStr = date.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
      const studentName = lesson.students
        ? `${lesson.students.onoma_mathiti} ${lesson.students.epitheto_mathiti || ''}`
        : '';
      const status = getPaymentStatusText(lesson.katastasi_pliromis);
      const notes = (lesson.simiwseis_mathimatos || '').replace(/"/g, '""'); // Escape quotes
      
      return `"${dateStr}","${timeStr}","${studentName}",${lesson.diarkeia_lepta},${lesson.timi},"${status}","${notes}"`;
    }).join('\n');
    
    const csvContent = header + rows;
    
    // Save to file
    const fileUri = FileSystem.documentDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
      return true;
    } else {
      Alert.alert('Σφάλμα', 'Η κοινοποίηση δεν είναι διαθέσιμη σε αυτήν τη συσκευή');
      return false;
    }
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η εξαγωγή των δεδομένων');
    return false;
  }
};

/**
 * Export students data to CSV format
 * @param {Array} students - Array of student objects
 * @param {string} filename - Name of the file to export
 * @returns {Promise<boolean>} Success status
 */
export const exportStudentsToCSV = async (students, filename = 'students.csv') => {
  try {
    // Create CSV header
    const header = 'Όνομα,Επώνυμο,Έτος Γέννησης,Γονέας,Τηλέφωνο,Email,Μέγεθος Βιολιού,Προεπ. Διάρκεια,Προεπ. Τιμή,Σημειώσεις\n';
    
    // Create CSV rows
    const rows = students.map(student => {
      const parentName = student.onoma_gonea || student.epitheto_gonea
        ? `${student.onoma_gonea || ''} ${student.epitheto_gonea || ''}`.trim()
        : '';
      const notes = (student.simiwseis || '').replace(/"/g, '""'); // Escape quotes
      
      return `"${student.onoma_mathiti}","${student.epitheto_mathiti || '"}",${student.etos_gennisis || ''},"${parentName}","${student.kinhto_tilefono}","${student.email || '"}","${student.megethos_violiou || '"}",${student.default_diarkeia || ''},${student.default_timi || ''},"${notes}"`;
    }).join('\n');
    
    const csvContent = header + rows;
    
    // Save to file
    const fileUri = FileSystem.documentDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
      return true;
    } else {
      Alert.alert('Σφάλμα', 'Η κοινοποίηση δεν είναι διαθέσιμη σε αυτήν τη συσκευή');
      return false;
    }
  } catch (error) {
    console.error('Error exporting students to CSV:', error);
    Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η εξαγωγή των δεδομένων');
    return false;
  }
};

/**
 * Export payment statistics to a formatted text file
 * @param {Object} stats - Payment statistics object
 * @param {string} period - Period description
 * @param {string} filename - Name of the file to export
 * @returns {Promise<boolean>} Success status
 */
export const exportPaymentStatsToText = async (stats, period, filename = 'payment_stats.txt') => {
  try {
    const content = `
Στατιστικά Πληρωμών
${period}
${'='.repeat(50)}

Συνολικά Μαθήματα: ${stats.total}
Συνολικά Έσοδα: ${stats.totalAmount.toFixed(2)}€

Ανάλυση:
- Πληρωμένα: ${stats.paid} (${((stats.paid / stats.total) * 100).toFixed(1)}%)
  Ποσό: ${stats.paidAmount.toFixed(2)}€

- Εκκρεμή: ${stats.pending} (${((stats.pending / stats.total) * 100).toFixed(1)}%)
  Ποσό: ${stats.pendingAmount.toFixed(2)}€

- Ακυρωμένα: ${stats.cancelled} (${((stats.cancelled / stats.total) * 100).toFixed(1)}%)

${'='.repeat(50)}
Δημιουργήθηκε: ${new Date().toLocaleString('el-GR')}
    `.trim();
    
    // Save to file
    const fileUri = FileSystem.documentDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
      return true;
    } else {
      Alert.alert('Σφάλμα', 'Η κοινοποίηση δεν είναι διαθέσιμη σε αυτήν τη συσκευή');
      return false;
    }
  } catch (error) {
    console.error('Error exporting stats to text:', error);
    Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η εξαγωγή των στατιστικών');
    return false;
  }
};

/**
 * Helper function to get payment status text
 */
const getPaymentStatusText = (status) => {
  switch (status) {
    case 'paid': return 'Πληρώθηκε';
    case 'pending': return 'Εκκρεμεί';
    case 'cancelled': return 'Ακυρώθηκε';
    default: return status;
  }
};

/**
 * Create a comprehensive data export with all information
 * @param {Object} data - Object containing students, lessons, and stats
 * @returns {Promise<boolean>} Success status
 */
export const exportAllData = async (data) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Export students
    if (data.students && data.students.length > 0) {
      await exportStudentsToCSV(data.students, `students_${timestamp}.csv`);
    }
    
    // Export lessons
    if (data.lessons && data.lessons.length > 0) {
      await exportLessonsToCSV(data.lessons, `lessons_${timestamp}.csv`);
    }
    
    // Export stats if available
    if (data.stats) {
      await exportPaymentStatsToText(data.stats, data.period || 'Όλες οι περίοδοι', `stats_${timestamp}.txt`);
    }
    
    return true;
  } catch (error) {
    console.error('Error exporting all data:', error);
    return false;
  }
};

export default {
  exportLessonsToCSV,
  exportStudentsToCSV,
  exportPaymentStatsToText,
  exportAllData,
};
