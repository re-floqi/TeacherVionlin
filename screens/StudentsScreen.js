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
import { getStudents, deleteStudent } from '../supabaseService';

export default function StudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStudents();
    });
    return unsubscribe;
  }, [navigation]);

  const loadStudents = async () => {
    const result = await getStudents();
    if (result.success) {
      setStudents(result.data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const handleDeleteStudent = (student) => {
    Alert.alert(
      'Διαγραφή Μαθητή',
      `Θέλετε να διαγράψετε τον/την ${student.onoma_mathiti} ${student.epitheto_mathiti || ''}; Θα διαγραφούν και όλα τα μαθήματα.`,
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteStudent(student.student_id);
            if (result.success) {
              loadStudents();
            } else {
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή του μαθητή');
            }
          },
        },
      ]
    );
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => navigation.navigate('AddEditStudent', { student: item })}
      onLongPress={() => handleDeleteStudent(item)}
    >
      <View style={styles.studentHeader}>
        <Text style={styles.studentName}>
          {item.onoma_mathiti} {item.epitheto_mathiti}
        </Text>
        {item.etos_gennisis && (
          <Text style={styles.studentAge}>
            ({new Date().getFullYear() - item.etos_gennisis} ετών)
          </Text>
        )}
      </View>
      
      <View style={styles.studentDetails}>
        <Text style={styles.studentDetail}>📞 {item.kinhto_tilefono}</Text>
        {item.megethos_violiou && (
          <Text style={styles.studentDetail}>🎻 {item.megethos_violiou}</Text>
        )}
      </View>

      {item.onoma_gonea && (
        <Text style={styles.parentInfo}>
          Γονέας: {item.onoma_gonea} {item.epitheto_gonea || ''}
        </Text>
      )}

      <View style={styles.defaultsInfo}>
        <Text style={styles.defaultText}>
          ⏱️ {item.default_diarkeia}' | 💶 {item.default_timi}€
        </Text>
      </View>

      {item.simiwseis && (
        <Text style={styles.studentNotes} numberOfLines={2}>
          📝 {item.simiwseis}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditStudent')}
        >
          <Text style={styles.addButtonText}>+ Νέος Μαθητής</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.student_id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Δεν υπάρχουν μαθητές</Text>
            <Text style={styles.emptyStateSubtext}>
              Πατήστε "Νέος Μαθητής" για να προσθέσετε
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  list: {
    padding: 16,
  },
  studentCard: {
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
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentAge: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  studentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 12,
  },
  studentDetail: {
    fontSize: 14,
    color: '#555',
  },
  parentInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  defaultsInfo: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  defaultText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  studentNotes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
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
  },
});
