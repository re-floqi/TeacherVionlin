import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { createBackup } from '../backupService';
import { exportAllData } from '../exportService';
import { requestNotificationPermissions } from '../notificationService';
import { generateUpcomingLessons } from '../recurringLessonUtils';
import { getStudents, getLessonsByDateRange, getPaymentStatistics } from '../supabaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Οθόνη ρυθμίσεων της εφαρμογής.
// Περιλαμβάνει επιλογές εμφάνισης, ειδοποιήσεων, αυτοματισμών και λειτουργίες για backup/export.
export default function SettingsScreen({ navigation }) {
  // Θεματικό context (σκούρο/φωτεινό)
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // Τοπικό state για τις ρυθμίσεις που ελέγχονται από τον χρήστη
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [autoGenerateLessons, setAutoGenerateLessons] = useState(false);

  // Κατά το mount, φορτώνουμε τις αποθηκευμένες ρυθμίσεις από το AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);

  // Διαβάζει τις ρυθμίσεις από το AsyncStorage και ενημερώνει το state
  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      const autoGenerate = await AsyncStorage.getItem('autoGenerateLessons');
      
      // Οι τιμές αποθηκεύονται ως 'true'/'false' strings -> μετατρέπουμε σε boolean
      setNotificationsEnabled(notifications === 'true');
      setAutoGenerateLessons(autoGenerate === 'true');
    } catch (error) {
      // Σφάλμα ανάγνωσης δεν πρέπει να σπάσει την εφαρμογή — το λογ θα βοηθήσει στην αποσφαλμάτωση
      console.error('Error loading settings:', error);
    }
  };

  // Εναλλαγή ειδοποιήσεων: ζητάμε άδεια αν ενεργοποιούμε, αποθηκεύουμε την επιλογή
  const toggleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        // Αν δεν είναι ενεργές, ζητάμε άδεια push ειδοποιήσεων
        const granted = await requestNotificationPermissions();
        if (granted) {
          setNotificationsEnabled(true);
          await AsyncStorage.setItem('notificationsEnabled', 'true');
          Alert.alert('Επιτυχία', 'Οι ειδοποιήσεις ενεργοποιήθηκαν');
        } else {
          Alert.alert('Σφάλμα', 'Δεν δόθηκε άδεια για ειδοποιήσεις');
        }
      } else {
        // Απενεργοποίηση ειδοποιήσεων
        setNotificationsEnabled(false);
        await AsyncStorage.setItem('notificationsEnabled', 'false');
        Alert.alert('Επιτυχία', 'Οι ειδοποιήσεις απενεργοποιήθηκαν');
      }
    } catch (error) {
      // Ενημέρωση χρήστη σε περίπτωση αποτυχίας
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η αλλαγή των ειδοποιήσεων');
    }
  };

  // Εναλλαγή αυτόματης δημιουργίας μαθημάτων από κανόνες επανάληψης
  const toggleAutoGenerate = async () => {
    try {
      const newValue = !autoGenerateLessons;
      setAutoGenerateLessons(newValue);
      await AsyncStorage.setItem('autoGenerateLessons', newValue ? 'true' : 'false');
      
      if (newValue) {
        // Ενημέρωση χρήστη για το τι σημαίνει αυτή η ρύθμιση
        Alert.alert(
          'Αυτόματη Δημιουργία',
          'Τα μαθήματα θα δημιουργούνται αυτόματα από τους κανόνες επανάληψης'
        );
      }
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η αλλαγή της ρύθμισης');
    }
  };

  // Δημιουργία backup: εμφανίζει confirmation dialog και εκτελεί το createBackup
  const handleBackup = async () => {
    Alert.alert(
      'Αντίγραφο Ασφαλείας',
      'Θέλετε να δημιουργήσετε αντίγραφο ασφαλείας των δεδομένων σας;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Δημιουργία',
          onPress: async () => {
            const success = await createBackup();
            if (success) {
              // Η createBackup μπορεί να εμφανίσει μήνυμα επιτυχίας/αποτυχίας εσωτερικά
            }
          },
        },
      ]
    );
  };

  // Εξαγωγή δεδομένων: φορτώνει δεδομένα και καλεί την υπηρεσία exportAllData
  const handleExport = async () => {
    Alert.alert(
      'Εξαγωγή Δεδομένων',
      'Επιλέξτε τι θέλετε να εξάγετε:',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Όλα τα Δεδομένα',
          onPress: async () => {
            try {
              // Φορτώνουμε μαθητές
              const studentsResult = await getStudents();
              const students = studentsResult.success ? studentsResult.data : [];
              
              // Φορτώνουμε μαθήματα από την αρχή του έτους μέχρι σήμερα
              const today = new Date();
              const startDate = new Date(today.getFullYear(), 0, 1);
              const lessonsResult = await getLessonsByDateRange(
                startDate.toISOString(),
                today.toISOString()
              );
              const lessons = lessonsResult.success ? lessonsResult.data : [];
              
              // Φορτώνουμε στατιστικά πληρωμών για την ίδια περίοδο
              const statsResult = await getPaymentStatistics(
                startDate.toISOString(),
                today.toISOString()
              );
              const stats = statsResult.success ? statsResult.data : null;
              
              // Καλούμε τον exporter που δημιουργεί αρχεία (π.χ. CSV) και τα κατεβάζει/μοιράζει
              await exportAllData({
                students,
                lessons,
                stats,
                period: 'Φέτος',
              });
              
              Alert.alert('Επιτυχία', 'Τα δεδομένα εξάχθηκαν επιτυχώς');
            } catch (error) {
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η εξαγωγή των δεδομένων');
            }
          },
        },
      ]
    );
  };

  // Χειροκίνητη δημιουργία μαθημάτων από κανόνες επανάληψης για N ημέρες
  const handleGenerateLessons = async () => {
    Alert.alert(
      'Δημιουργία Μαθημάτων',
      'Θέλετε να δημιουργήσετε μαθήματα για τις επόμενες 30 ημέρες από τους κανόνες επανάληψης;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Δημιουργία',
          onPress: async () => {
            // generateUpcomingLessons επιστρέφει αντικείμενο με πεδία success, count, errors
            const result = await generateUpcomingLessons(30);
            if (result.success) {
              // Εμφάνιση αποτελέσματος με πιθανές προειδοποιήσεις
              Alert.alert(
                'Επιτυχία',
                `Δημιουργήθηκαν ${result.count} μαθήματα${result.errors ? '\n\nΠροειδοποιήσεις: ' + result.errors.join('\n') : ''}`
              );
            } else {
              Alert.alert('Σφάλμα', result.error || 'Δεν ήταν δυνατή η δημιουργία μαθημάτων');
            }
          },
        },
      ]
    );
  };

  // UI: εμφάνιση ρυθμίσεων με χρήση του θεματικού context για χρώματα
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Εμφάνιση</Text>
        
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Σκούρο Θέμα</Text>
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              Χρήση σκούρου χρωματισμού για την εφαρμογή
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ειδοποιήσεις</Text>
        
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Ειδοποιήσεις Push</Text>
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              Λάβετε ειδοποιήσεις για επερχόμενα μαθήματα και υπενθυμίσεις πληρωμής
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Αυτοματισμοί</Text>
        
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Αυτόματη Δημιουργία Μαθημάτων</Text>
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              Δημιουργία μαθημάτων από κανόνες επανάληψης
            </Text>
          </View>
          <Switch
            value={autoGenerateLessons}
            onValueChange={toggleAutoGenerate}
            trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
            thumbColor={autoGenerateLessons ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={handleGenerateLessons}
        >
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            🔄 Δημιουργία Μαθημάτων (30 ημέρες)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Δεδομένα</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={handleBackup}
        >
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            💾 Δημιουργία Αντιγράφου Ασφαλείας
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={handleExport}
        >
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            📊 Εξαγωγή Δεδομένων (CSV)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.versionText, { color: theme.colors.textTertiary }]}>
          Έκδοση 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Βασική διάταξη και στυλ για την οθόνη ρυθμίσεων
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
});
