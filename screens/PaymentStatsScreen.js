import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getPaymentStatistics } from '../supabaseService';

export default function PaymentStatsScreen() {
  const [period, setPeriod] = useState('month'); // 'month', 'year', 'all'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [period]);

  const getDateRange = () => {
    const today = new Date();
    let startDate;

    switch (period) {
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case 'all':
        startDate = new Date(2000, 0, 1); // Far past date
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    return {
      startDate: startDate.toISOString(),
      endDate: today.toISOString(),
    };
  };

  const loadStats = async () => {
    setLoading(true);
    const { startDate, endDate } = getDateRange();
    const result = await getPaymentStatistics(startDate, endDate);
    
    if (result.success) {
      setStats(result.data);
    } else {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση των στατιστικών');
    }
    setLoading(false);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'month': return 'Αυτό το μήνα';
      case 'year': return 'Φέτος';
      case 'all': return 'Όλες οι περίοδοι';
      default: return '';
    }
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
        <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>

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
  periodLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
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
});
