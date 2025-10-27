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
import { addStudent, updateStudent, deleteStudent } from '../supabaseService';

// Οθόνη για προσθήκη / επεξεργασία μαθητή.
// Παρέχει φόρμα με πεδία μαθητή/γονέα, validation, αποθήκευση και διαγραφή.
export default function AddEditStudentScreen({ route, navigation }) {
  // Παίρνουμε το αντικείμενο student αν προήλθε από επεξεργασία
  const { student } = route.params || {};
  const isEditing = !!student; // true όταν επεξεργαζόμαστε υπάρχοντα μαθητή

  // Τοπικό state: αντικείμενο φόρμας με προεπιλεγμένες τιμές
  const [formData, setFormData] = useState({
    onoma_mathiti: '',
    epitheto_mathiti: '',
    etos_gennisis: '',
    onoma_gonea: '',
    epitheto_gonea: '',
    kinhto_tilefono: '',
    email: '',
    megethos_violiou: '',
    default_diarkeia: '40',
    default_timi: '',
    simiwseis: '',
  });

  // Όταν φορτώνει η οθόνη και υπάρχει student, γεμίζουμε τη φόρμα με τα δεδομένα
  useEffect(() => {
    if (student) {
      setFormData({
        onoma_mathiti: student.onoma_mathiti || '',
        epitheto_mathiti: student.epitheto_mathiti || '',
        etos_gennisis: student.etos_gennisis?.toString() || '',
        onoma_gonea: student.onoma_gonea || '',
        epitheto_gonea: student.epitheto_gonea || '',
        kinhto_tilefono: student.kinhto_tilefono || '',
        email: student.email || '',
        megethos_violiou: student.megethos_violiou || '',
        default_diarkeia: student.default_diarkeia?.toString() || '40',
        default_timi: student.default_timi?.toString() || '',
        simiwseis: student.simiwseis || '',
      });
    }
  }, [student]);

  // Αποθήκευση μαθητή: είτε δημιουργία νέου είτε ενημέρωση υπάρχοντος
  const handleSave = async () => {
    // Βασικός έλεγχος υποχρεωτικών πεδίων
    if (!formData.onoma_mathiti || !formData.kinhto_tilefono) {
      Alert.alert('Σφάλμα', 'Το όνομα και το τηλέφωνο είναι υποχρεωτικά');
      return;
    }

    // Μετατροπές τύπων πριν την αποστολή στο backend
    const dataToSave = {
      ...formData,
      etos_gennisis: formData.etos_gennisis ? parseInt(formData.etos_gennisis) : null,
      default_diarkeia: parseInt(formData.default_diarkeia) || 40,
      default_timi: formData.default_timi ? parseFloat(formData.default_timi) : null,
    };

    let result;
    if (isEditing) {
      // Ενημέρωση υπάρχοντος μαθητή βάσει student.student_id
      result = await updateStudent(student.student_id, dataToSave);
    } else {
      // Προσθήκη νέου μαθητή
      result = await addStudent(dataToSave);
    }

    // Ενημέρωση χρήστη ανάλογα με το αποτέλεσμα
    if (result.success) {
      Alert.alert(
        'Επιτυχία',
        isEditing ? 'Ο μαθητής ενημερώθηκε' : 'Ο μαθητής προστέθηκε',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Σφάλμα', result.error || 'Κάτι πήγε στραβά');
    }
  };

  // Διαγραφή μαθητή με επιβεβαίωση — προειδοποιούμε ότι θα διαγραφούν και τα μαθήματα
  const handleDelete = () => {
    Alert.alert(
      'Διαγραφή Μαθητή',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον μαθητή; Αυτό θα διαγράψει και όλα τα μαθήματα του.',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteStudent(student.student_id);
            if (result.success) {
              Alert.alert(
                'Επιτυχία',
                'Ο μαθητής διαγράφηκε',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } else {
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή του μαθητή');
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

  // UI: φόρμα με τμήματα (στοιχεία μαθητή, γονέα, επικοινωνία, λεπτομέρειες)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          {/* Ενότητα στοιχείων μαθητή */}
          <Text style={styles.sectionTitle}>Στοιχεία Μαθητή</Text>

          <Text style={styles.label}>Όνομα *</Text>
          <TextInput
            style={styles.input}
            value={formData.onoma_mathiti}
            onChangeText={(value) => updateField('onoma_mathiti', value)}
            placeholder="π.χ. Γιώργος"
          />

          <Text style={styles.label}>Επώνυμο</Text>
          <TextInput
            style={styles.input}
            value={formData.epitheto_mathiti}
            onChangeText={(value) => updateField('epitheto_mathiti', value)}
            placeholder="π.χ. Παπαδόπουλος"
          />

          <Text style={styles.label}>Έτος Γέννησης</Text>
          <TextInput
            style={styles.input}
            value={formData.etos_gennisis}
            onChangeText={(value) => updateField('etos_gennisis', value)}
            placeholder="π.χ. 2015"
            keyboardType="numeric"
          />

          {/* Ενότητα στοιχείων γονέα */}
          <Text style={styles.sectionTitle}>Στοιχεία Γονέα</Text>

          <Text style={styles.label}>Όνομα Γονέα</Text>
          <TextInput
            style={styles.input}
            value={formData.onoma_gonea}
            onChangeText={(value) => updateField('onoma_gonea', value)}
            placeholder="π.χ. Μαρία"
          />

          <Text style={styles.label}>Επώνυμο Γονέα</Text>
          <TextInput
            style={styles.input}
            value={formData.epitheto_gonea}
            onChangeText={(value) => updateField('epitheto_gonea', value)}
            placeholder="π.χ. Παπαδοπούλου"
          />

          {/* Επικοινωνία */}
          <Text style={styles.sectionTitle}>Επικοινωνία</Text>

          <Text style={styles.label}>Κινητό Τηλέφωνο *</Text>
          <TextInput
            style={styles.input}
            value={formData.kinhto_tilefono}
            onChangeText={(value) => updateField('kinhto_tilefono', value)}
            placeholder="π.χ. 6912345678"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="π.χ. example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Λεπτομέρειες μαθημάτων */}
          <Text style={styles.sectionTitle}>Λεπτομέρειες Μαθημάτων</Text>

          <Text style={styles.label}>Μέγεθος Βιολιού</Text>
          <TextInput
            style={styles.input}
            value={formData.megethos_violiou}
            onChangeText={(value) => updateField('megethos_violiou', value)}
            placeholder="π.χ. 4/4, 3/4, 1/2, 1/4"
          />

          <Text style={styles.label}>Προεπιλεγμένη Διάρκεια (λεπτά)</Text>
          <TextInput
            style={styles.input}
            value={formData.default_diarkeia}
            onChangeText={(value) => updateField('default_diarkeia', value)}
            placeholder="π.χ. 40"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Προεπιλεγμένη Τιμή (€)</Text>
          <TextInput
            style={styles.input}
            value={formData.default_timi}
            onChangeText={(value) => updateField('default_timi', value)}
            placeholder="π.χ. 20.00"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Σημειώσεις</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.simiwseis}
            onChangeText={(value) => updateField('simiwseis', value)}
            placeholder="Γενικές σημειώσεις για τον μαθητή"
            multiline
            numberOfLines={4}
          />

          {/* Κουμπί αποθήκευσης */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Ενημέρωση Μαθητή' : 'Προσθήκη Μαθητή'}
            </Text>
          </TouchableOpacity>

          {/* Κουμπί διαγραφής μόνο σε λειτουργία επεξεργασίας */}
          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Διαγραφή Μαθητή</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Βασικά container και layout
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

  // Ενότητα και ετικέτες πεδίων
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },

  // Πεδία εισαγωγής
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

  // Κουμπιά
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
