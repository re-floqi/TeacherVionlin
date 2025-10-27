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

// Οθόνη που εμφανίζει τους κανόνες επανάληψης για μαθήματα.
// Δίνει τη δυνατότητα προβολής, ανανέωσης και διαγραφής κανόνων επανάληψης.
export default function RecurringLessonsScreen({ navigation }) {
  // Τοπικό state: λίστα επαναλαμβανόμενων μαθημάτων και κατάσταση refresh
  const [recurringLessons, setRecurringLessons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Φορτώνουμε τους κανόνες κατά το mount της οθόνης
  useEffect(() => {
    loadRecurringLessons();
  }, []);

  // Όταν η οθόνη αποκτά focus (π.χ. μετά από edit/add), ξαναφορτώνουμε τα δεδομένα
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecurringLessons();
    });
    return unsubscribe;
  }, [navigation]);

  // Συνάρτηση που τραβάει τους κανόνες από το backend και ενημερώνει το state
  const loadRecurringLessons = async () => {
    const result = await getRecurringLessons();
    if (result.success) {
      setRecurringLessons(result.data);
    }
  };

  // Χειρισμός pull-to-refresh: εμφανίζει τον loader και ξαναφορτώνει τα δεδομένα
  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecurringLessons();
    setRefreshing(false);
  };

  // Μετατροπή αριθμού ημέρας (0-6) σε όνομα ημέρας στα Ελληνικά
  const getDayName = (dayNumber) => {
    const days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
    return days[dayNumber] || '';
  };

  // Διαγραφή κανόνα επανάληψης με επιβεβαίωση χρήστη
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
              // Αν διαγραφή επιτυχής, ξαναφορτώνουμε την λίστα
              loadRecurringLessons();
            } else {
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή');
            }
          },
        },
      ]
    );
  };

  // Render function για κάθε κάρτα κανόνα επανάληψης
  const renderRecurringLesson = ({ item }) => (
    <TouchableOpacity
      style={styles.recurringCard}
      // Tap: επεξεργασία κανόνα
      onPress={() => navigation.navigate('AddEditRecurringLesson', { recurringLesson: item })}
      // Long press για διαγραφή κανόνα
      onLongPress={() => handleDeleteRecurring(item)}
    >
      <View style={styles.recurringHeader}>
        {/* Εμφάνιση ημέρας & ώρας κανόνα */}
        <Text style={styles.dayBadge}>{getDayName(item.imera_evdomadas)}</Text>
        <Text style={styles.timeText}>{item.ora_enarksis}</Text>
      </View>

      {/* Όνομα μαθητή που αφορά ο κανόνας (σύνδεση μέσω relation) */}
      <Text style={styles.studentName}>
        {item.students?.onoma_mathiti} {item.students?.epitheto_mathiti}
      </Text>

      {/* Βασικές λεπτομέρειες: διάρκεια & τιμή */}
      <View style={styles.detailsRow}>
        <Text style={styles.detail}>⏱️ {item.diarkeia_lepta} λεπτά</Text>
        <Text style={styles.detail}>💶 {item.timi}€</Text>
      </View>

      {/* Περιοχή που δείχνει το εύρος ημερομηνιών επανάληψης (έναρξη / προαιρετική λήξη) */}
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

  // UI: header με πληροφορία και λίστα κανόνων με pull-to-refresh και empty state
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Τα επαναλαμβανόμενα μαθήματα δημιουργούν αυτόματα μαθήματα κάθε εβδομάδα.
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditRecurringLesson')}
        >
          <Text style={styles.addButtonText}>+ Νέος Κανόνας</Text>
        </TouchableOpacity>
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
  // Συνολικά container και header
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
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#5e72e4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Λίστα και κάρτα κανόνα
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

  // Στυλ για την ημέρα (badge) και ώρα
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

  // Στοιχεία μαθητή & λεπτομέρειες
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

  // Περιοχή με ημερομηνίες έναρξης/λήξης της επανάληψης
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

  // Empty state στυλ
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
