import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addRecurringLesson, updateRecurringLesson, deleteRecurringLesson, getStudents } from '../supabaseService';

// Οθόνη για προσθήκη / επεξεργασία επαναλαμβανόμενου μαθήματος.
// Περιέχει φόρμα, έλεγχο πεδίων, λογική αποθήκευσης και διαγραφής.
export default function AddEditRecurringLessonScreen({ route, navigation }) {
  // Παίρνουμε το recurring lesson από το route (όταν επεξεργαζόμαστε)
  const { recurringLesson } = route.params || {};
  const isEditing = !!recurringLesson; // true αν υπάρχει => λειτουργία επεξεργασίας

  // Τοπικό state
  const [students, setStudents] = useState([]); // λίστα μαθητών για το Picker
  const [formData, setFormData] = useState({
    student_id: '',
    imera_evdomadas: '1', // Δευτέρα by default
    ora_enarksis: '17:00',
    diarkeia_lepta: '40',
    timi: '',
    enarxi_epanallipsis: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    lixi_epanallipsis: '', // Προαιρετικό
  });

  // useEffect για αρχικό φόρτωμα μαθητών και γέμισμα φόρμας αν επεξεργαζόμαστε
  useEffect(() => {
    loadStudents();
    
    if (recurringLesson) {
      // Αν έχουμε recurring lesson (επεξεργασία), γεμίζουμε τη φόρμα
      setFormData({
        student_id: recurringLesson.student_id?.toString() || '',
        imera_evdomadas: recurringLesson.imera_evdomadas?.toString() || '1',
        ora_enarksis: recurringLesson.ora_enarksis || '17:00',
        diarkeia_lepta: recurringLesson.diarkeia_lepta?.toString() || '40',
        timi: recurringLesson.timi?.toString() || '',
        enarxi_epanallipsis: recurringLesson.enarxi_epanallipsis || new Date().toISOString().split('T')[0],
        lixi_epanallipsis: recurringLesson.lixi_epanallipsis || '',
      });
    }
  }, [recurringLesson]);

  // Φόρτωση μαθητών από το supabaseService
  const loadStudents = async () => {
    const result = await getStudents();
    if (result.success) {
      setStudents(result.data);
      
      // Auto-select student if there's only one (μόνο κατά προσθήκης)
      if (!isEditing && result.data.length === 1) {
        setFormData(prev => ({ 
          ...prev, 
          student_id: result.data[0].student_id.toString(),
          diarkeia_lepta: result.data[0].default_diarkeia?.toString() || '40',
          timi: result.data[0].default_timi?.toString() || '',
        }));
      }
    }
  };

  // Όταν αλλάζει η επιλογή μαθητή στο Picker
  const handleStudentChange = (studentId) => {
    const student = students.find(s => s.student_id.toString() === studentId);
    // Αν υπάρχει ο μαθητής και είμαστε σε λειτουργία προσθήκης, γεμίζουμε προεπιλεγμένα πεδία
    if (student && !isEditing) {
      setFormData({
        ...formData,
        student_id: studentId,
        diarkeia_lepta: student.default_diarkeia?.toString() || '40',
        timi: student.default_timi?.toString() || '',
      });
    } else {
      setFormData({ ...formData, student_id: studentId });
    }
  };

  // Αποθήκευση επαναλαμβανόμενου μαθήματος (προσθήκη ή ενημέρωση)
  const handleSave = async () => {
    // Βασικός έλεγχος ότι τα υποχρεωτικά πεδία είναι συμπληρωμένα
    if (!formData.student_id || !formData.ora_enarksis || !formData.diarkeia_lepta || !formData.timi || !formData.enarxi_epanallipsis) {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }

    // Προετοιμασία αντικειμένου για αποστολή στο backend
    const dataToSave = {
      student_id: parseInt(formData.student_id),
      imera_evdomadas: parseInt(formData.imera_evdomadas),
      ora_enarksis: formData.ora_enarksis,
      diarkeia_lepta: parseInt(formData.diarkeia_lepta),
      timi: parseFloat(formData.timi),
      enarxi_epanallipsis: formData.enarxi_epanallipsis,
      lixi_epanallipsis: formData.lixi_epanallipsis || null,
    };

    let result;
    if (isEditing) {
      // Ενημέρωση υπάρχοντος κανόνα επανάληψης
      result = await updateRecurringLesson(recurringLesson.recurring_id, dataToSave);
    } else {
      // Προσθήκη νέου κανόνα επανάληψης
      result = await addRecurringLesson(dataToSave);
    }

    // Ειδοποίηση χρήστη ανάλογα με το αποτέλεσμα της αποθήκευσης
    if (result.success) {
      Alert.alert(
        'Επιτυχία',
        isEditing ? 'Ο κανόνας επανάληψης ενημερώθηκε' : 'Ο κανόνας επανάληψης προστέθηκε',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Σφάλμα', result.error || 'Κάτι πήγε στραβά');
    }
  };

  // Διαγραφή κανόνα επανάληψης με επιβεβαίωση
  const handleDelete = () => {
    Alert.alert(
      'Διαγραφή Επαναλαμβανόμενου Μαθήματος',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον κανόνα επανάληψης;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteRecurringLesson(recurringLesson.recurring_id);
            if (result.success) {
              navigation.goBack();
            } else {
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή του κανόνα επανάληψης');
            }
          },
        },
      ]
    );
  };

  // Βοηθητική συνάρτηση για ενημέρωση πεδίου φόρμας
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Ονόματα ημερών για το Picker
  const dayNames = [
    { label: 'Κυριακή', value: '0' },
    { label: 'Δευτέρα', value: '1' },
    { label: 'Τρίτη', value: '2' },
    { label: 'Τετάρτη', value: '3' },
    { label: 'Πέμπτη', value: '4' },
    { label: 'Παρασκευή', value: '5' },
    { label: 'Σάββατο', value: '6' },
  ];

  // UI: φόρμα με πεδία, Pickers, κουμπιά
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Μαθητής *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.student_id}
              onValueChange={handleStudentChange}
              style={styles.picker}
            >
              <Picker.Item label="Επιλέξτε μαθητή..." value="" />
              {students.map((student) => (
                <Picker.Item
                  key={student.student_id}
                  label={`${student.onoma_mathiti} ${student.epitheto_mathiti || ''}`}
                  value={student.student_id.toString()}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Ημέρα Εβδομάδας *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.imera_evdomadas}
              onValueChange={(value) => updateField('imera_evdomadas', value)}
              style={styles.picker}
            >
              {dayNames.map((day) => (
                <Picker.Item key={day.value} label={day.label} value={day.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Ώρα Έναρξης *</Text>
          <TextInput
            style={styles.input}
            value={formData.ora_enarksis}
            onChangeText={(value) => updateField('ora_enarksis', value)}
            placeholder="HH:MM"
          />

          <Text style={styles.label}>Διάρκεια (λεπτά) *</Text>
          <TextInput
            style={styles.input}
            value={formData.diarkeia_lepta}
            onChangeText={(value) => updateField('diarkeia_lepta', value)}
            placeholder="π.χ. 40"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Τιμή (€) *</Text>
          <TextInput
            style={styles.input}
            value={formData.timi}
            onChangeText={(value) => updateField('timi', value)}
            placeholder="π.χ. 20.00"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Ημερομηνία Έναρξης *</Text>
          <TextInput
            style={styles.input}
            value={formData.enarxi_epanallipsis}
            onChangeText={(value) => updateField('enarxi_epanallipsis', value)}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Ημερομηνία Λήξης (προαιρετικό)</Text>
          <TextInput
            style={styles.input}
            value={formData.lixi_epanallipsis}
            onChangeText={(value) => updateField('lixi_epanallipsis', value)}
            placeholder="YYYY-MM-DD (αφήστε κενό για αόριστο)"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Ενημέρωση Κανόνα' : 'Προσθήκη Κανόνα'}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Διαγραφή Κανόνα</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: '#5e72e4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
