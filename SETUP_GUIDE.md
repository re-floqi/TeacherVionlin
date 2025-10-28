# Οδηγός Ρύθμισης - Teacher Violin App

## Βήμα 1: Προετοιμασία Περιβάλλοντος

### Εγκατάσταση Node.js
1. Κατεβάστε και εγκαταστήστε το Node.js από https://nodejs.org/
2. Επιβεβαιώστε την εγκατάσταση:
   ```bash
   node --version
   npm --version
   ```

### Εγκατάσταση Expo CLI
```bash
npm install -g expo-cli
```

## Βήμα 2: Ρύθμιση Supabase

### Δημιουργία Project
1. Μεταβείτε στο https://supabase.com
2. Κάντε εγγραφή ή σύνδεση
3. Πατήστε "New Project"
4. Συμπληρώστε:
   - Project Name: π.χ. "teacher-violin"
   - Database Password: (κρατήστε το κάπου ασφαλές)
   - Region: Διαλέξτε το πλησιέστερο στην τοποθεσία σας
   - Pricing Plan: Διαλέξτε το Free tier

### Εκτέλεση SQL Schema
1. Στο Supabase Dashboard, πηγαίνετε στο "SQL Editor"
2. Πατήστε "+ New Query"
3. Αντιγράψτε και επικολλήστε όλο το περιεχόμενο του αρχείου `supabase_setup.sql`
4. Πατήστε "Run" για να εκτελέσετε το script

**Σημαντικό:** Το `supabase_setup.sql` περιλαμβάνει:
- Πλήρη δομή βάσης δεδομένων (tables, policies, constraints)
- Row Level Security (RLS) policies για ασφάλεια
- Indexes για καλύτερη απόδοση
- CASCADE constraints για αυτόματη διαχείριση διαγραφών

### Λήψη API Keys
1. Πηγαίνετε στο "Settings" > "API"
2. Αντιγράψτε τα εξής:
   - Project URL (π.χ. https://xxxxx.supabase.co)
   - anon public key (μακρύ string που αρχίζει με eyJ...)

### Δημιουργία Χρήστη
1. Πηγαίνετε στο "Authentication" > "Users"
2. Πατήστε "Add User" > "Create new user"
3. Συμπληρώστε:
   - Email: το email σας
   - Password: επιλέξτε ένα ισχυρό password
   - Auto Confirm User: ✓ (enabled)
4. Πατήστε "Create User"

## Βήμα 3: Ρύθμιση Εφαρμογής

### Clone Repository
```bash
git clone https://github.com/re-floqi/TeacherVionlin.git
cd TeacherVionlin
```

### Εγκατάσταση Dependencies
```bash
npm install
```

### Ρύθμιση Environment Variables
1. Αντιγράψτε το `.env.example` σε `.env`:
   ```bash
   cp .env.example .env
   ```

2. Ανοίξτε το `.env` με έναν text editor και συμπληρώστε:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...το_μακρύ_key_σας
   ```

## Βήμα 4: Εκκίνηση Εφαρμογής

### Εκκίνηση Development Server
```bash
npm start
```

Αυτό θα ανοίξει το Expo DevTools στον browser σας.

### Τρόποι Προβολής

#### Στο κινητό σας (Συνιστάται)
1. Κατεβάστε την εφαρμογή "Expo Go":
   - iOS: App Store
   - Android: Google Play Store
2. Σκανάρετε το QR code που εμφανίζεται στο terminal ή browser
3. Η εφαρμογή θα φορτωθεί στο κινητό σας

#### Στον browser (για testing)
- Πατήστε το "w" στο terminal ή το "Run in web browser" στο DevTools
- Θα ανοίξει στο http://localhost:19006

#### Σε Simulator/Emulator
- iOS Simulator (μόνο σε Mac): Πατήστε "i"
- Android Emulator: Πατήστε "a"

## Βήμα 5: Πρώτη Χρήση

### Σύνδεση
1. Όταν ανοίξει η εφαρμογή, θα δείτε την οθόνη σύνδεσης
2. Εισάγετε το email και password που δημιουργήσατε στο Supabase
3. Πατήστε "Σύνδεση"

### Προσθήκη Πρώτου Μαθητή
1. Από την αρχική οθόνη, πατήστε "👥 Μαθητές"
2. Πατήστε "+ Νέος Μαθητής"
3. Συμπληρώστε τα στοιχεία (Όνομα και Τηλέφωνο είναι υποχρεωτικά)
4. Πατήστε "Προσθήκη Μαθητή"

### Προσθήκη Πρώτου Μαθήματος
1. Επιστρέψτε στην αρχική οθόνη
2. Επιλέξτε μια ημερομηνία στο ημερολόγιο
3. Πατήστε "+ Νέο"
4. Επιλέξτε μαθητή, ώρα, διάρκεια και τιμή
5. Πατήστε "Προσθήκη Μαθήματος"

## Βήμα 6: Deployment (Προαιρετικό)

### Για Testing με άλλους
Το πιο απλό: Στείλτε το QR code ή το link που εμφανίζεται όταν τρέχετε `npm start` σε άλλους χρήστες που έχουν την εφαρμογή Expo Go.

### Για Production

#### Web (Netlify)
1. Build:
   ```bash
   expo build:web
   ```
2. Ανεβάστε το φάκελο `web-build` στο Netlify

#### Mobile Apps
Για αναλυτικές οδηγίες, δείτε το κύριο README.md

## Αντιμετώπιση Προβλημάτων

### Πρόβλημα: "Cannot connect to Metro"
**Λύση**: Σιγουρευτείτε ότι το κινητό και ο υπολογιστής είναι στο ίδιο Wi-Fi

### Πρόβλημα: "Sign in error"
**Λύση**: 
- Ελέγξτε ότι το .env έχει τα σωστά credentials
- Επανεκκινήστε την εφαρμογή (πατήστε "r" στο terminal)
- Βεβαιωθείτε ότι ο χρήστης έχει δημιουργηθεί στο Supabase

### Πρόβλημα: "Module not found"
**Λύση**: 
```bash
rm -rf node_modules
npm install
```

### Πρόβλημα: Expo cache issues
**Λύση**:
```bash
expo start -c
```

## Χρήσιμα Commands

```bash
# Εκκίνηση με clear cache
npm start -- --clear

# Εκκίνηση σε συγκεκριμένο port
npm start -- --port 19001

# Build για production
expo build:web
expo build:android
expo build:ios

# Publish στο Expo
expo publish
```

## Επόμενα Βήματα

1. Εξοικειωθείτε με την εφαρμογή
2. Προσθέστε τους μαθητές σας
3. Προγραμματίστε τα μαθήματα σας
4. Παρακολουθήστε τις πληρωμές
5. Χρησιμοποιήστε τα στατιστικά για καλύτερη οργάνωση

## Υποστήριξη

Για περισσότερες πληροφορίες:
- Supabase Documentation: https://supabase.com/docs
- Expo Documentation: https://docs.expo.dev/
- React Native Documentation: https://reactnative.dev/

Για προβλήματα με την εφαρμογή, ανοίξτε ένα issue στο GitHub repository.
