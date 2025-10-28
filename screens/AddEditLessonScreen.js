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
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addLesson, updateLesson, deleteLesson, getStudents, addRecurringLesson } from '../supabaseService';

// Οθόνη για προσθήκη / επεξεργασία μαθήματος.
// Περιέχει φόρμα, έλεγχο πεδίων, λογική αποθήκευσης και διαγραφής,
// καθώς και επιλογή για δημιουργία εβδομαδιαίου κανόνα επανάληψης.
export default function AddEditLessonScreen({ route, navigation }) {
  // Παίρνουμε τα παραμέτρους από το route: lesson (όταν επεξεργαζόμαστε) και selectedDate
  const { lesson, selectedDate } = route.params || {};
  const isEditing = !!lesson; // true αν υπάρχει lesson => λειτουργία επεξεργασίας

  // Τοπικό state
  const [students, setStudents] = useState([]); // λίστα μαθητών για το Picker
  const [isRecurring, setIsRecurring] = useState(false); // σημαία για επαναλαμβανόμενο μάθημα
  const [formData, setFormData] = useState({
    // Αρχικά πεδία φόρμας με λογικές προεπιλογές
    student_id: '',
    date: selectedDate || new Date().toISOString().split('T')[0], // YYYY-MM-DD
    time: '17:00',
    diarkeia_lepta: '40',
    timi: '',
    katastasi_pliromis: 'pending',
    simiwseis_mathimatos: '',
    endDate: '', // Ημερομηνία λήξης για επαναλαμβανόμενα μαθήματα (υποχρεωτικό)
  });

  // useEffect για αρχικό φόρτωμα μαθητών και γέμισμα φόρμας αν επεξεργαζόμαστε
  useEffect(() => {
    loadStudents();
    
    if (lesson) {
      // Αν έχουμε lesson (επεξεργασία), μετατρέπουμε την ημερομηνία έναρξης
      const lessonDate = new Date(lesson.imera_ora_enarksis);
      setFormData({
        student_id: lesson.student_id?.toString() || '',
        date: lessonDate.toISOString().split('T')[0],
        // ΤοLocaleTimeString με 'en-GB' δίνει μορφή HH:MM 24ωρη
        time: lessonDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        diarkeia_lepta: lesson.diarkeia_lepta?.toString() || '40',
        timi: lesson.timi?.toString() || '',
        katastasi_pliromis: lesson.katastasi_pliromis || 'pending',
        simiwseis_mathimatos: lesson.simiwseis_mathimatos || '',
      });
    }
  }, [lesson]);

  // Φόρτωση μαθητών από το supabaseService και αυτόματη επιλογή αν υπάρχει μόνο ένας μαθητής
  const loadStudents = async () => {
    const result = await getStudents();
    if (result.success) {
      setStudents(result.data);
      
      // Auto-select student if there's only one (μόνο κατά προσθήκης, όχι κατά επεξεργασία)
      if (!isEditing && result.data.length === 1) {
        setFormData(prev => ({ 
          ...prev, 
          student_id: result.data[0].student_id.toString(),
          // Γέμισμα προεπιλεγμένων τιμών από τον μαθητή αν υπάρχουν
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
      // Απλώς αλλάζουμε τον επιλεγμένο student_id
      setFormData({ ...formData, student_id: studentId });
    }
  };

  // Αποθήκευση μαθήματος (προσθήκη ή ενημέρωση). Επίσης δημιουργία κανόνα επανάληψης αν ζητηθεί.
  const handleSave = async () => {
    // Βασικός έλεγχος ότι τα υποχρεωτικά πεδία είναι συμπληρωμένα
    if (!formData.student_id || !formData.date || !formData.time || !formData.diarkeia_lepta || !formData.timi) {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }

    // Αν είναι επαναλαμβανόμενο μάθημα, το endDate είναι ΑΠΟΛΥΤΩΣ ΥΠΟΧΡΕΩΤΙΚΟ
    if (isRecurring && !formData.endDate) {
      Alert.alert('Σφάλμα', 'Πρέπει να ορίσετε ημερομηνία λήξης για την επανάληψη');
      return;
    }

    // Δημιουργία ISO ημερομηνίας+ώρας για αποθήκευση (προσθέτουμε :00 για δευτερόλεπτα)
    const dateTime = new Date(`${formData.date}T${formData.time}:00`);
    
    let result;
    
    // Αν είναι επαναλαμβανόμενο μάθημα, αποθηκεύουμε ΜΟΝΟ στον πίνακα recurring_lessons
    if (isRecurring && !isEditing) {
      // Προετοιμασία δεδομένων για κανόνα επανάληψης
      const recurringData = {
        student_id: parseInt(formData.student_id),
        imera_evdomadas: dateTime.getDay(), // Ημέρα εβδομάδας (0-6)
        ora_enarksis: formData.time,
        diarkeia_lepta: parseInt(formData.diarkeia_lepta),
        timi: parseFloat(formData.timi),
        enarxi_epanallipsis: formData.date,
        lixi_epanallipsis: formData.endDate, // Υποχρεωτική ημερομηνία λήξης
      };
      
      result = await addRecurringLesson(recurringData);
    } else {
      // Προετοιμασία αντικειμένου για αποστολή στο backend (μεμονωμένο μάθημα)
      const dataToSave = {
        student_id: parseInt(formData.student_id),
        imera_ora_enarksis: dateTime.toISOString(),
        diarkeia_lepta: parseInt(formData.diarkeia_lepta),
        timi: parseFloat(formData.timi),
        katastasi_pliromis: formData.katastasi_pliromis,
        simiwseis_mathimatos: formData.simiwseis_mathimatos || null,
      };

      if (isEditing) {
        // Ενημέρωση υπάρχοντος μαθήματος με το lesson.lesson_id
        result = await updateLesson(lesson.lesson_id, dataToSave);
      } else {
        // Προσθήκη νέου μαθήματος
        result = await addLesson(dataToSave);
      }
    }

    // Ειδοποίηση χρήστη ανάλογα με το αποτέλεσμα της αποθήκευσης
    if (result.success) {
      Alert.alert(
        'Επιτυχία',
        isRecurring && !isEditing
          ? 'Ο κανόνας επανάληψης προστέθηκε επιτυχώς'
          : isEditing
          ? 'Το μάθημα ενημερώθηκε επιτυχώς'
          : 'Το μάθημα προστέθηκε επιτυχώς',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      // Εμφάνιση σφάλματος αν αποτύχει η αποθήκευση
      Alert.alert('Σφάλμα', result.error || 'Κάτι πήγε στραβά');
    }
  };

  // Διαγραφή μαθήματος με επιβεβαίωση
  const handleDelete = () => {
    Alert.alert(
      'Διαγραφή Μαθήματος',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μάθημα;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            // Κλήση deleteLesson και επαναφόρτωση / επιστροφή πίσω
            const result = await deleteLesson(lesson.lesson_id);
            if (result.success) {
              navigation.goBack();
            } else {
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή του μαθήματος');
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

  // UI: φόρμα με πεδία, Picker για μαθητές/κατάσταση πληρωμής, switch για επαναληπτικά, κουμπιά
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

          <Text style={styles.label}>Ημερομηνία *</Text>
          <TextInput
            style={styles.input}
            value={formData.date}
            onChangeText={(value) => updateField('date', value)}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Ώρα Έναρξης *</Text>
          <TextInput
            style={styles.input}
            value={formData.time}
            onChangeText={(value) => updateField('time', value)}
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

          <Text style={styles.label}>Κατάσταση Πληρωμής</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.katastasi_pliromis}
              onValueChange={(value) => updateField('katastasi_pliromis', value)}
              style={styles.picker}
            >
              <Picker.Item label="Εκκρεμεί" value="pending" />
              <Picker.Item label="Πληρώθηκε" value="paid" />
              <Picker.Item label="Ακυρώθηκε" value="cancelled" />
            </Picker>
          </View>

          <Text style={styles.label}>Σημειώσεις Μαθήματος</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.simiwseis_mathimatos}
            onChangeText={(value) => updateField('simiwseis_mathimatos', value)}
            placeholder="Σημειώσεις για αυτό το μάθημα"
            multiline
            numberOfLines={4}
          />

          {!isEditing && (
            <>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Επαναλαμβανόμενο μάθημα (κάθε εβδομάδα)</Text>
                <Switch
                  value={isRecurring}
                  onValueChange={setIsRecurring}
                  trackColor={{ false: '#ccc', true: '#5e72e4' }}
                  thumbColor={isRecurring ? '#fff' : '#f4f3f4'}
                />
              </View>

              {isRecurring && (
                <>
                  <Text style={styles.label}>Ημερομηνία Λήξης Επανάληψης *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.endDate}
                    onChangeText={(value) => updateField('endDate', value)}
                    placeholder="YYYY-MM-DD (υποχρεωτικό)"
                  />
                  <Text style={styles.helperText}>
                    Η ημερομηνία λήξης είναι υποχρεωτική για επαναλαμβανόμενα μαθήματα
                  </Text>
                </>
              )}
            </>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Ενημέρωση Μαθήματος' : 'Προσθήκη Μαθήματος'}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Διαγραφή Μαθήματος</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Στυλ για την οθόνη — διατηρούνται όπως ήταν
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
