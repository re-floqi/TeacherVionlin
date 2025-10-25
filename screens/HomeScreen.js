import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getLessonsByDateRange, signOut } from '../supabaseService';
import { useTheme } from '../ThemeContext';

export default function HomeScreen({ navigation, onLogout }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [lessons, setLessons] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    // Load lessons for the current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const result = await getLessonsByDateRange(
      firstDay.toISOString(),
      lastDay.toISOString()
    );

    if (result.success) {
      setLessons(result.data);
      markLessonDates(result.data);
    }
  };

  const markLessonDates = (lessonData) => {
    const marked = {};
    lessonData.forEach(lesson => {
      const date = lesson.imera_ora_enarksis.split('T')[0];
      if (!marked[date]) {
        marked[date] = { marked: true, dotColor: '#5e72e4' };
      }
    });
    marked[selectedDate] = { ...marked[selectedDate], selected: true, selectedColor: '#5e72e4' };
    setMarkedDates(marked);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLessons();
    setRefreshing(false);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    const newMarked = { ...markedDates };
    Object.keys(newMarked).forEach(date => {
      newMarked[date] = { ...newMarked[date], selected: false };
    });
    newMarked[day.dateString] = { ...newMarked[day.dateString], selected: true, selectedColor: '#5e72e4' };
    setMarkedDates(newMarked);
  };

  const getLessonsForSelectedDate = () => {
    return lessons.filter(lesson => {
      const lessonDate = lesson.imera_ora_enarksis.split('T')[0];
      return lessonDate === selectedDate;
    }).sort((a, b) => new Date(a.imera_ora_enarksis) - new Date(b.imera_ora_enarksis));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Πληρώθηκε';
      case 'pending': return 'Εκκρεμεί';
      case 'cancelled': return 'Ακυρώθηκε';
      default: return status;
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Αποσύνδεση',
      'Θέλετε να αποσυνδεθείτε;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Αποσύνδεση',
          onPress: async () => {
            await signOut();
            onLogout();
          },
        },
      ]
    );
  };

  const selectedDateLessons = getLessonsForSelectedDate();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Students')}
          >
            <Text style={styles.headerButtonText}>👥 Μαθητές</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('RecurringLessons')}
          >
            <Text style={styles.headerButtonText}>🔄 Επαναλ.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('PaymentStats')}
          >
            <Text style={styles.headerButtonText}>💰 Στατ.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleTheme}
          >
            <Text style={styles.headerButtonText}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.headerButtonText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Calendar
          current={selectedDate}
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          theme={{
            backgroundColor: theme.colors.card,
            calendarBackground: theme.colors.card,
            textSectionTitleColor: theme.colors.text,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: '#fff',
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.text,
            textDisabledColor: theme.colors.disabled,
            arrowColor: theme.colors.primary,
            dotColor: theme.colors.primary,
            monthTextColor: theme.colors.text,
          }}
        />

        <View style={styles.lessonsContainer}>
          <View style={styles.lessonsDayHeader}>
            <Text style={[styles.lessonsDayHeaderText, { color: theme.colors.text }]}>
              Μαθήματα {new Date(selectedDate).toLocaleDateString('el-GR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('AddEditLesson', { selectedDate })}
            >
              <Text style={styles.addButtonText}>+ Νέο</Text>
            </TouchableOpacity>
          </View>

          {selectedDateLessons.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.colors.textTertiary }]}>
                Δεν υπάρχουν μαθήματα αυτή την ημέρα
              </Text>
            </View>
          ) : (
            selectedDateLessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.lesson_id}
                style={[styles.lessonCard, { backgroundColor: theme.colors.card }]}
                onPress={() => navigation.navigate('AddEditLesson', { lesson })}
              >
                <View style={styles.lessonHeader}>
                  <Text style={[styles.lessonTime, { color: theme.colors.text }]}>
                    {formatTime(lesson.imera_ora_enarksis)}
                  </Text>
                  <View style={[styles.paymentBadge, { backgroundColor: getPaymentStatusColor(lesson.katastasi_pliromis) }]}>
                    <Text style={styles.paymentBadgeText}>{getPaymentStatusText(lesson.katastasi_pliromis)}</Text>
                  </View>
                </View>
                <Text style={[styles.lessonStudent, { color: theme.colors.textSecondary }]}>
                  {lesson.students?.onoma_mathiti} {lesson.students?.epitheto_mathiti}
                </Text>
                <View style={styles.lessonDetails}>
                  <Text style={[styles.lessonDetail, { color: theme.colors.textSecondary }]}>
                    ⏱️ {lesson.diarkeia_lepta} λεπτά
                  </Text>
                  <Text style={[styles.lessonDetail, { color: theme.colors.textSecondary }]}>
                    💶 {lesson.timi}€
                  </Text>
                </View>
                {lesson.simiwseis_mathimatos && (
                  <Text style={[styles.lessonNotes, { color: theme.colors.textTertiary }]}>
                    {lesson.simiwseis_mathimatos}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#5e72e4',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  logoutButton: {
    flex: 0.5,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  lessonsContainer: {
    padding: 16,
  },
  lessonsDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lessonsDayHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#5e72e4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#999',
    fontSize: 14,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  lessonStudent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  lessonDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  lessonDetail: {
    fontSize: 14,
    color: '#666',
  },
  lessonNotes: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
