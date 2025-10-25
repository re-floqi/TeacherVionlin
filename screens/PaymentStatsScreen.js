import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getPaymentStatistics, getLessonsByDateRange, updateLessonPayment } from '../supabaseService';

export default function PaymentStatsScreen({ navigation }) {
  const [period, setPeriod] = useState('month'); // 'month', 'year', 'all'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [stats, setStats] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [period, currentMonth]);

  const getDateRange = () => {
    const referenceDate = period === 'month' ? currentMonth : new Date();
    let startDate;
    let endDate;

    switch (period) {
      case 'month':
        startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
        endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'year':
        startDate = new Date(referenceDate.getFullYear(), 0, 1);
        endDate = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59);
        break;
      case 'all':
        startDate = new Date(2000, 0, 1); // Far past date
        endDate = new Date();
        break;
      default:
        startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
        endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59);
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  const loadStats = async () => {
    setLoading(true);
    const { startDate, endDate } = getDateRange();
    const statsResult = await getPaymentStatistics(startDate, endDate);
    const lessonsResult = await getLessonsByDateRange(startDate, endDate);
    
    if (statsResult.success) {
      setStats(statsResult.data);
    } else {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση των στατιστικών');
    }

    if (lessonsResult.success) {
      setLessons(lessonsResult.data);
    }
    
    setLoading(false);
  };

  const handlePaymentStatusChange = async (lessonId, newStatus) => {
    const result = await updateLessonPayment(lessonId, newStatus);
    
    if (result.success) {
      // Reload stats and lessons
      await loadStats();
      Alert.alert('Επιτυχία', 'Η κατάσταση πληρωμής ενημερώθηκε');
    } else {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η ενημέρωση της κατάστασης πληρωμής');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    setLoading(false);
  };

  const getPeriodLabel = () => {
    if (period === 'month') {
      return currentMonth.toLocaleDateString('el-GR', { year: 'numeric', month: 'long' });
    }
    switch (period) {
      case 'year': return 'Φέτος';
      case 'all': return 'Όλες οι περίοδοι';
      default: return '';
    }
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const canGoNext = () => {
    const today = new Date();
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth <= today;
  };

  if (loading || !stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Φόρτωση...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
          onPress={() => setPeriod('month')}
        >
          <Text style={[styles.periodButtonText, period === 'month' && styles.periodButtonTextActive]}>
            Μήνας
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, period === 'year' && styles.periodButtonActive]}
          onPress={() => setPeriod('year')}
        >
          <Text style={[styles.periodButtonText, period === 'year' && styles.periodButtonTextActive]}>
            Έτος
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, period === 'all' && styles.periodButtonActive]}
          onPress={() => setPeriod('all')}
        >
          <Text style={[styles.periodButtonText, period === 'all' && styles.periodButtonTextActive]}>
            Όλα
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {period === 'month' && (
          <View style={styles.monthNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={goToPreviousMonth}
            >
              <Text style={styles.navButtonText}>← Προηγούμενος</Text>
            </TouchableOpacity>
            <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>
            <TouchableOpacity
              style={[styles.navButton, !canGoNext() && styles.navButtonDisabled]}
              onPress={goToNextMonth}
              disabled={!canGoNext()}
            >
              <Text style={[styles.navButtonText, !canGoNext() && styles.navButtonTextDisabled]}>
                Επόμενος →
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {period !== 'month' && (
          <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>
        )}

        <View style={styles.mainStatsCard}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatLabel}>Συνολικά Μαθήματα</Text>
            <Text style={styles.mainStatValue}>{stats.total}</Text>
          </View>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatLabel}>Συνολικά Έσοδα</Text>
            <Text style={styles.mainStatValue}>{stats.totalAmount.toFixed(2)}€</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.paidCard]}>
            <Text style={styles.statIcon}>✓</Text>
            <Text style={styles.statLabel}>Πληρωμένα</Text>
            <Text style={styles.statCount}>{stats.paid}</Text>
            <Text style={styles.statAmount}>{stats.paidAmount.toFixed(2)}€</Text>
          </View>

          <View style={[styles.statCard, styles.pendingCard]}>
            <Text style={styles.statIcon}>⏳</Text>
            <Text style={styles.statLabel}>Εκκρεμή</Text>
            <Text style={styles.statCount}>{stats.pending}</Text>
            <Text style={styles.statAmount}>{stats.pendingAmount.toFixed(2)}€</Text>
          </View>

          <View style={[styles.statCard, styles.cancelledCard]}>
            <Text style={styles.statIcon}>✗</Text>
            <Text style={styles.statLabel}>Ακυρωμένα</Text>
            <Text style={styles.statCount}>{stats.cancelled}</Text>
            <Text style={styles.statAmount}>-</Text>
          </View>
        </View>

        {stats.total > 0 && (
          <View style={styles.percentagesCard}>
            <Text style={styles.percentagesTitle}>Ποσοστά</Text>
            <View style={styles.percentageRow}>
              <Text style={styles.percentageLabel}>Πληρωμένα:</Text>
              <Text style={[styles.percentageValue, styles.paidText]}>
                {((stats.paid / stats.total) * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.percentageRow}>
              <Text style={styles.percentageLabel}>Εκκρεμή:</Text>
              <Text style={[styles.percentageValue, styles.pendingText]}>
                {((stats.pending / stats.total) * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.percentageRow}>
              <Text style={styles.percentageLabel}>Ακυρωμένα:</Text>
              <Text style={[styles.percentageValue, styles.cancelledText]}>
                {((stats.cancelled / stats.total) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        )}

        {stats.pending > 0 && (
          <View style={styles.alertCard}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertText}>
              Υπάρχουν {stats.pending} εκκρεμή μαθήματα ({stats.pendingAmount.toFixed(2)}€)
            </Text>
          </View>
        )}

        {lessons.length > 0 && (
          <View style={styles.lessonsSection}>
            <Text style={styles.sectionTitle}>Λίστα Μαθημάτων</Text>
            {lessons.map((lesson) => (
              <View key={lesson.lesson_id} style={styles.lessonRow}>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonStudent}>
                    {lesson.students?.onoma_mathiti} {lesson.students?.epitheto_mathiti}
                  </Text>
                  <Text style={styles.lessonDate}>
                    {formatDateTime(lesson.imera_ora_enarksis)}
                  </Text>
                  <Text style={styles.lessonAmount}>{lesson.timi}€</Text>
                </View>
                <View style={styles.lessonActions}>
                  <View style={[styles.statusBadge, { backgroundColor: getPaymentStatusColor(lesson.katastasi_pliromis) }]}>
                    <Text style={styles.statusBadgeText}>
                      {getPaymentStatusText(lesson.katastasi_pliromis)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      Alert.alert(
                        'Αλλαγή Κατάστασης',
                        'Επιλέξτε νέα κατάσταση πληρωμής',
                        [
                          { text: 'Ακυρο', style: 'cancel' },
                          {
                            text: 'Εκκρεμεί',
                            onPress: () => handlePaymentStatusChange(lesson.lesson_id, 'pending'),
                          },
                          {
                            text: 'Πληρώθηκε',
                            onPress: () => handlePaymentStatusChange(lesson.lesson_id, 'paid'),
                          },
                          {
                            text: 'Ακυρώθηκε',
                            onPress: () => handlePaymentStatusChange(lesson.lesson_id, 'cancelled'),
                            style: 'destructive',
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.editButtonText}>✎</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
    color: '#999',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#5e72e4',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    backgroundColor: '#5e72e4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  mainStatsCard: {
    backgroundColor: '#5e72e4',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mainStat: {
    alignItems: 'center',
  },
  mainStatLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  mainStatValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  paidCard: {
    borderLeftColor: '#28a745',
  },
  pendingCard: {
    borderLeftColor: '#ffc107',
  },
  cancelledCard: {
    borderLeftColor: '#dc3545',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 14,
    color: '#666',
  },
  percentagesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  percentagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  percentageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  percentageLabel: {
    fontSize: 14,
    color: '#666',
  },
  percentageValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paidText: {
    color: '#28a745',
  },
  pendingText: {
    color: '#ffc107',
  },
  cancelledText: {
    color: '#dc3545',
  },
  alertCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
  },
  lessonsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  lessonRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonStudent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lessonDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  lessonAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5e72e4',
  },
  lessonActions: {
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#5e72e4',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
