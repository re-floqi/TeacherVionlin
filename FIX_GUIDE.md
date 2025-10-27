# Οδηγός Διόρθωσης - Λειτουργίες Διαγραφής και Επεξεργασίας

## Περίληψη Αλλαγών

Αυτό το PR διορθώνει όλες τις λειτουργίες που δεν λειτουργούσαν σωστά:

1. ✅ **Διαγραφή Μαθητών** - Τώρα λειτουργεί σωστά
2. ✅ **Διαγραφή Μαθημάτων** - Τώρα λειτουργεί σωστά
3. ✅ **Επεξεργασία Μαθημάτων** - Τώρα λειτουργεί σωστά
4. ✅ **Επεξεργασία Πληρωμής** - Τώρα λειτουργεί σωστά (ήδη υπήρχε στο PaymentStatsScreen)
5. ✅ **Επαναλαμβανόμενα Μαθήματα** - Προστέθηκε πλήρης υποστήριξη επεξεργασίας

---

## ⚠️ ΣΗΜΑΝΤΙΚΟ - Αλλαγές στη Βάση Δεδομένων

**ΠΡΕΠΕΙ** να εκτελέσετε το αρχείο `database_changes.sql` στη Supabase για να λειτουργήσουν όλες οι αλλαγές.

### Πώς να εκτελέσετε τις αλλαγές στη Supabase:

1. Συνδεθείτε στο [Supabase Dashboard](https://app.supabase.com)
2. Επιλέξτε το project σας
3. Πηγαίνετε στο **SQL Editor** (αριστερό μενού)
4. Ανοίξτε το αρχείο `database_changes.sql` που βρίσκεται στο root του project
5. Αντιγράψτε όλο το περιεχόμενο
6. Επικολλήστε το στο SQL Editor
7. Πατήστε **Run** για να εκτελέσετε τις αλλαγές

### Τι κάνει το database_changes.sql:

- **Διορθώνει τα RLS Policies**: Δημιουργεί ξεχωριστά policies για SELECT, INSERT, UPDATE, DELETE
- **Διορθώνει CASCADE Constraints**: Εξασφαλίζει ότι όταν διαγράφεται ένας μαθητής, διαγράφονται αυτόματα όλα τα σχετικά δεδομένα (μαθήματα, επαναλαμβανόμενα μαθήματα, πρόοδος)
- **Προσθέτει Indexes**: Βελτιώνει την απόδοση των queries
- **Δίνει Permissions**: Εξασφαλίζει ότι οι authenticated χρήστες έχουν πρόσβαση σε όλες τις λειτουργίες

---

## Αλλαγές στον Κώδικα

### 1. Διορθώσεις Typos

**Αρχεία που άλλαξαν:**
- `screens/HomeScreen.js`
- `screens/AddEditLessonScreen.js`

**Αλλαγή:** `epitheto_mathimati` → `epitheto_mathiti`

Αυτό ήταν ένα τυπογραφικό λάθος που εμπόδιζε την σωστή εμφάνιση του επωνύμου των μαθητών.

---

### 2. Νέα Οθόνη: AddEditRecurringLessonScreen

**Νέο Αρχείο:** `screens/AddEditRecurringLessonScreen.js`

Αυτή η οθόνη επιτρέπει:
- ➕ Προσθήκη νέων κανόνων επανάληψης
- ✏️ Επεξεργασία υπαρχόντων κανόνων επανάληψης
- 🗑️ Διαγραφή κανόνων επανάληψης

**Λειτουργίες:**
- Επιλογή μαθητή από dropdown
- Επιλογή ημέρας εβδομάδας (Δευτέρα, Τρίτη, κλπ.)
- Ώρα έναρξης
- Διάρκεια μαθήματος
- Τιμή
- Ημερομηνία έναρξης επανάληψης
- Προαιρετική ημερομηνία λήξης επανάληψης

---

### 3. Ενημερώσεις στο RecurringLessonsScreen

**Αρχείο:** `screens/RecurringLessonsScreen.js`

**Νέες Λειτουργίες:**
- ➕ Κουμπί "Νέος Κανόνας" για δημιουργία νέων επαναλαμβανόμενων μαθημάτων
- ✏️ Tap στο card για επεξεργασία του κανόνα
- 🗑️ Long press στο card για διαγραφή του κανόνα

---

### 4. Ενημέρωση Navigation

**Αρχείο:** `App.js`

Προστέθηκε η νέα οθόνη στο navigation stack:
```jsx
<Stack.Screen 
  name="AddEditRecurringLesson" 
  component={AddEditRecurringLessonScreen}
  options={({ route }) => ({ 
    title: route.params?.recurringLesson ? 'Επεξεργασία Κανόνα' : 'Νέος Κανόνας Επανάληψης' 
  })}
/>
```

---

## Πώς να δοκιμάσετε τις αλλαγές

### 1. Διαγραφή Μαθητή
1. Πηγαίνετε στην οθόνη "Μαθητές"
2. Κάντε **long press** σε έναν μαθητή
3. Επιβεβαιώστε τη διαγραφή
4. Ο μαθητής θα διαγραφεί μαζί με όλα τα μαθήματά του

### 2. Διαγραφή Μαθήματος
1. Πηγαίνετε στην αρχική οθόνη (Ημερολόγιο)
2. Πατήστε σε ένα μάθημα
3. Πατήστε το κουμπί "Διαγραφή Μαθήματος"
4. Επιβεβαιώστε τη διαγραφή

### 3. Επεξεργασία Μαθήματος
1. Πηγαίνετε στην αρχική οθόνη (Ημερολόγιο)
2. Πατήστε σε ένα μάθημα
3. Αλλάξτε τα πεδία που θέλετε (ώρα, διάρκεια, τιμή, κατάσταση πληρωμής)
4. Πατήστε "Ενημέρωση Μαθήματος"

### 4. Επεξεργασία Πληρωμής
1. Πηγαίνετε στην οθόνη "Στατιστικά Πληρωμών"
2. Κάντε scroll στη λίστα μαθημάτων
3. Πατήστε το κουμπί επεξεργασίας (✎) δίπλα σε ένα μάθημα
4. Επιλέξτε τη νέα κατάσταση (Εκκρεμεί/Πληρώθηκε/Ακυρώθηκε)

### 5. Επαναλαμβανόμενα Μαθήματα

#### Δημιουργία νέου κανόνα:
1. Πηγαίνετε στην οθόνη "Επαναλαμβανόμενα Μαθήματα"
2. Πατήστε "+ Νέος Κανόνας"
3. Συμπληρώστε τη φόρμα
4. Πατήστε "Προσθήκη Κανόνα"

#### Επεξεργασία κανόνα:
1. Πηγαίνετε στην οθόνη "Επαναλαμβανόμενα Μαθήματα"
2. Πατήστε σε έναν κανόνα (tap)
3. Αλλάξτε τα πεδία που θέλετε
4. Πατήστε "Ενημέρωση Κανόνα"

#### Διαγραφή κανόνα:
1. Πηγαίνετε στην οθόνη "Επαναλαμβανόμενα Μαθήματα"
2. Κάντε **long press** σε έναν κανόνα
3. Επιβεβαιώστε τη διαγραφή

---

## Τεχνικές Λεπτομέρειες

### Backend (Supabase)

Όλες οι λειτουργίες CRUD υπάρχουν ήδη στο `supabaseService.js`:
- `deleteStudent(studentId)`
- `deleteLesson(lessonId)`
- `updateLesson(lessonId, lessonData)`
- `updateLessonPayment(lessonId, newStatus)`
- `deleteRecurringLesson(recurringId)`
- `updateRecurringLesson(recurringId, recurringData)`
- `addRecurringLesson(recurringData)`

### Frontend (React Native)

Όλα τα screens έχουν ενημερωθεί για να χρησιμοποιούν σωστά τις συναρτήσεις του backend:
- `StudentsScreen.js` - Διαγραφή μαθητών με long press
- `AddEditLessonScreen.js` - Επεξεργασία και διαγραφή μαθημάτων
- `PaymentStatsScreen.js` - Επεξεργασία κατάστασης πληρωμής
- `RecurringLessonsScreen.js` - Προβολή και διαγραφή κανόνων
- `AddEditRecurringLessonScreen.js` - **ΝΕΟ** - Προσθήκη και επεξεργασία κανόνων

---

## Τι να κάνετε αν κάτι δεν λειτουργεί

### Αν η διαγραφή/επεξεργασία δεν λειτουργεί:

1. **Ελέγξτε ότι εκτελέσατε το database_changes.sql στη Supabase**
   - Αυτό είναι το πιο σημαντικό βήμα!

2. **Ελέγξτε τα RLS Policies στη Supabase:**
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, cmd 
   FROM pg_policies 
   WHERE tablename IN ('students', 'lessons', 'recurring_lessons', 'student_progress');
   ```
   - Θα πρέπει να δείτε policies για SELECT, INSERT, UPDATE, DELETE για κάθε πίνακα

3. **Ελέγξτε τα CASCADE constraints:**
   ```sql
   SELECT tc.table_name, tc.constraint_name, tc.constraint_type, 
          kcu.column_name, ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          rc.delete_rule, rc.update_rule
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
     ON ccu.constraint_name = tc.constraint_name
   JOIN information_schema.referential_constraints AS rc
     ON rc.constraint_name = tc.constraint_name
   WHERE tc.constraint_type = 'FOREIGN KEY'
     AND tc.table_name IN ('lessons', 'recurring_lessons', 'student_progress');
   ```
   - Το `delete_rule` θα πρέπει να είναι 'CASCADE'

4. **Ελέγξτε ότι είστε συνδεδεμένοι στην εφαρμογή**
   - Τα RLS policies επιτρέπουν πρόσβαση μόνο σε authenticated χρήστες

5. **Δείτε τα console logs**
   - Ανοίξτε το Metro bundler και δείτε αν υπάρχουν σφάλματα
   - Κάθε συνάρτηση στο supabaseService.js καταγράφει σφάλματα

---

## Σύνοψη

Όλες οι απαιτούμενες λειτουργίες έχουν υλοποιηθεί και είναι έτοιμες για χρήση:

- ✅ Διαγραφή μαθητών
- ✅ Διαγραφή μαθημάτων
- ✅ Επεξεργασία μαθημάτων
- ✅ Επεξεργασία πληρωμών
- ✅ Πλήρης υποστήριξη επαναλαμβανόμενων μαθημάτων (προσθήκη, επεξεργασία, διαγραφή)

**Το μόνο που χρειάζεται είναι να εκτελέσετε το `database_changes.sql` στη Supabase!**

Αν χρειάζεστε βοήθεια, ανατρέξτε στα sections "Πώς να δοκιμάσετε τις αλλαγές" και "Τι να κάνετε αν κάτι δεν λειτουργεί" πιο πάνω.
