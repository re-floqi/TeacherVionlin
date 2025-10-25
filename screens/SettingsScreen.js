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

export default function SettingsScreen({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [autoGenerateLessons, setAutoGenerateLessons] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      const autoGenerate = await AsyncStorage.getItem('autoGenerateLessons');
      
      setNotificationsEnabled(notifications === 'true');
      setAutoGenerateLessons(autoGenerate === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        const granted = await requestNotificationPermissions();
        if (granted) {
          setNotificationsEnabled(true);
          await AsyncStorage.setItem('notificationsEnabled', 'true');
          Alert.alert('Επιτυχία', 'Οι ειδοποιήσεις ενεργοποιήθηκαν');
        } else {
          Alert.alert('Σφάλμα', 'Δεν δόθηκε άδεια για ειδοποιήσεις');
        }
      } else {
        setNotificationsEnabled(false);
        await AsyncStorage.setItem('notificationsEnabled', 'false');
        Alert.alert('Επιτυχία', 'Οι ειδοποιήσεις απενεργοποιήθηκαν');
      }
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η αλλαγή των ειδοποιήσεων');
    }
  };

  const toggleAutoGenerate = async () => {
    try {
      const newValue = !autoGenerateLessons;
      setAutoGenerateLessons(newValue);
      await AsyncStorage.setItem('autoGenerateLessons', newValue ? 'true' : 'false');
      
      if (newValue) {
        Alert.alert(
          'Αυτόματη Δημιουργία',
          'Τα μαθήματα θα δημιουργούνται αυτόματα από τους κανόνες επανάληψης'
        );
      }
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η αλλαγή της ρύθμισης');
    }
  };

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
              // Backup success message shown in createBackup
            }
          },
        },
      ]
    );
  };

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
              // Fetch all data
              const studentsResult = await getStudents();
              const students = studentsResult.success ? studentsResult.data : [];
              
              const today = new Date();
              const startDate = new Date(today.getFullYear(), 0, 1);
              const lessonsResult = await getLessonsByDateRange(
                startDate.toISOString(),
                today.toISOString()
              );
              const lessons = lessonsResult.success ? lessonsResult.data : [];
              
              const statsResult = await getPaymentStatistics(
                startDate.toISOString(),
                today.toISOString()
              );
              const stats = statsResult.success ? statsResult.data : null;
              
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

  const handleGenerateLessons = async () => {
    Alert.alert(
      'Δημιουργία Μαθημάτων',
      'Θέλετε να δημιουργήσετε μαθήματα για τις επόμενες 30 ημέρες από τους κανόνες επανάληψης;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Δημιουργία',
          onPress: async () => {
            const result = await generateUpcomingLessons(30);
            if (result.success) {
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
