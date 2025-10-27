import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { signIn } from '../supabaseService';

// Οθόνη σύνδεσης χρήστη.
// Περιέχει φόρμα email/password, validation και κλήση στο supabaseService για σύνδεση.
export default function LoginScreen({ onLogin }) {
  // Τοπικό state για τα πεδία της φόρμας και κατάσταση φόρτωσης
  const [email, setEmail] = useState('');          // Εισαγόμενο email χρήστη
  const [password, setPassword] = useState('');    // Εισαγόμενος κωδικός
  const [loading, setLoading] = useState(false);   // Σημαία για απενεργοποίηση κουμπιού κατά την αίτηση

  // Χειριστής του κουμπιού σύνδεσης
  // - Ελέγχει ότι έχουν συμπληρωθεί πεδία
  // - Καλεί την signIn συνάρτηση του supabaseService
  // - Ειδοποιεί τον γονέα (onLogin) σε επιτυχία ή εμφανίζει Alert σε αποτυχία
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε email και κωδικό');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      // Ενημέρωση ανώτερου component ότι ο χρήστης συνδέθηκε επιτυχώς
      onLogin();
    } else {
      // Εμφάνιση σφάλματος σύνδεσης στον χρήστη
      Alert.alert('Σφάλμα σύνδεσης', result.error || 'Παρακαλώ ελέγξτε τα στοιχεία σας');
    }
  };

  // UI: φόρμα σύνδεσης με keyboard avoiding για κινητά
  // Περιλαμβάνει: λογότυπο, πεδία email/password, κουμπί σύνδεσης και σημείωμα
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Εικονίδιο / λογότυπο της εφαρμογής */}
          <Text style={styles.logo}>🎻</Text>
          <Text style={styles.title}>Διαχείριση Μαθημάτων</Text>
          <Text style={styles.subtitle}>Βιολί</Text>
        </View>

        <View style={styles.form}>
          {/* Πεδία εισαγωγής χρήστη */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Κωδικός"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          {/* Κουμπί σύνδεσης: απενεργοποιείται όταν loading */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Σύνδεση...' : 'Σύνδεση'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Σύντομη πληροφορία/οδηγία για τον χρήστη */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Για πρώτη χρήση, δημιουργήστε λογαριασμό στο Supabase
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Στυλ: διατηρούμε την υπάρχουσα δομή και προσθέτουμε περιγραφικές ετικέτες
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5e72e4',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#5e72e4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
});
