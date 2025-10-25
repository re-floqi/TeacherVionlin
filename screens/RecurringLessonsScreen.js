import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { getRecurringLessons, deleteRecurringLesson } from '../supabaseService';

export default function RecurringLessonsScreen({ navigation }) {
  const [recurringLessons, setRecurringLessons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecurringLessons();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecurringLessons();
    });
    return unsubscribe;
  }, [navigation]);

  const loadRecurringLessons = async () => {
    const result = await getRecurringLessons();
    if (result.success) {
      setRecurringLessons(result.data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecurringLessons();
    setRefreshing(false);
  };

  const getDayName = (dayNumber) => {
    const days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
    return days[dayNumber] || '';
  };

  const handleDeleteRecurring = (recurring) => {
    Alert.alert(
      'Διαγραφή Επαναλαμβανόμενου Μαθήματος',
      'Θέλετε να διαγράψετε αυτόν τον κανόνα επανάληψης;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteRecurringLesson(recurring.recurring_id);
            if (result.success) {
              loadRecurringLessons();
            } else {
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή');
            }
          },
        },
      ]
    );
  };

  const renderRecurringLesson = ({ item }) => (
    <TouchableOpacity
      style={styles.recurringCard}
      onLongPress={() => handleDeleteRecurring(item)}
    >
      <View style={styles.recurringHeader}>
        <Text style={styles.dayBadge}>{getDayName(item.imera_evdomadas)}</Text>
        <Text style={styles.timeText}>{item.ora_enarksis}</Text>
      </View>

      <Text style={styles.studentName}>
        {item.students?.onoma_mathiti} {item.students?.epitheto_mathiti}
      </Text>

      <View style={styles.detailsRow}>
        <Text style={styles.detail}>⏱️ {item.diarkeia_lepta} λεπτά</Text>
        <Text style={styles.detail}>💶 {item.timi}€</Text>
      </View>

      <View style={styles.dateRange}>
        <Text style={styles.dateText}>
          Από: {new Date(item.enarxi_epanallipsis).toLocaleDateString('el-GR')}
        </Text>
        {item.lixi_epanallipsis && (
          <Text style={styles.dateText}>
            Έως: {new Date(item.lixi_epanallipsis).toLocaleDateString('el-GR')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Τα επαναλαμβανόμενα μαθήματα δημιουργούν αυτόματα μαθήματα κάθε εβδομάδα.
        </Text>
      </View>

      <FlatList
        data={recurringLessons}
        renderItem={renderRecurringLesson}
        keyExtractor={(item) => item.recurring_id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Δεν υπάρχουν επαναλαμβανόμενα μαθήματα
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Προσθέστε κανόνες επανάληψης για τακτικά μαθήματα
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff7e6',
    borderBottomWidth: 1,
    borderBottomColor: '#ffd966',
  },
  headerText: {
    fontSize: 13,
    color: '#856404',
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  recurringCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5e72e4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recurringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayBadge: {
    backgroundColor: '#5e72e4',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  dateRange: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
});
