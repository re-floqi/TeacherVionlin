# TeacherVionlin

Εφαρμογή διαχείρισης μαθημάτων βιολιού με ημερολόγιο, καταγραφή μαθητών και διαχείριση πληρωμών.

## Περιγραφή

Αυτή η εφαρμογή επιτρέπει την καταγραφή και διαχείριση:
- **Μαθητών**: Ονόματα, στοιχεία επικοινωνίας, μέγεθος βιολιού
- **Μαθημάτων**: Ημερομηνία, ώρα, διάρκεια, τιμή και κατάσταση πληρωμής
- **Επαναλαμβανόμενων Μαθημάτων**: Κανόνες για εβδομαδιαία επαναλαμβανόμενα μαθήματα

Η εφαρμογή χρησιμοποιεί το [Argon React Native](https://demos.creative-tim.com/argon-react-native/) ως βάση για το UI.

## Περιεχόμενα

- `supabase-schema.sql`: SQL schema για τη βάση δεδομένων Supabase
- `supabaseService.js`: JavaScript functions για αλληλεπίδραση με το Supabase

## Εγκατάσταση

### 1. Δημιουργία Supabase Project

1. Πηγαίνετε στο [Supabase](https://supabase.com/) και δημιουργήστε ένα νέο project
2. Αφού δημιουργηθεί το project, πηγαίνετε στο SQL Editor
3. Αντιγράψτε και εκτελέστε το περιεχόμενο του αρχείου `supabase-schema.sql`

### 2. Ρύθμιση Περιβάλλοντος

Δημιουργήστε ένα αρχείο `.env` στο root του project σας με τα εξής:

```env
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Αυτά τα credentials μπορείτε να τα βρείτε στο Supabase Dashboard > Settings > API.

### 3. Εγκατάσταση Dependencies

```bash
npm install @supabase/supabase-js
```

## Χρήση

### Παραδείγματα Χρήσης

```javascript
import {
  getStudents,
  addStudent,
  getLessonsByDateRange,
  addLesson,
  updateLessonPayment
} from './supabaseService';

// Προσθήκη μαθητή
const newStudent = await addStudent({
  onoma_mathiti: 'Γιάννης',
  epitheto_mathiti: 'Παπαδόπουλος',
  kinhto_tilefono: '6912345678',
  etos_gennisis: 2015,
  megethos_violiou: '1/2',
  default_diarkeia: 45,
  default_timi: 25.00
});

// Λήψη όλων των μαθητών
const students = await getStudents();

// Προσθήκη μαθήματος
const newLesson = await addLesson({
  student_id: newStudent.student_id,
  imera_ora_enarksis: new Date('2025-10-25T17:00:00'),
  diarkeia_lepta: 45,
  timi: 25.00,
  katastasi_pliromis: 'pending'
});

// Λήψη μαθημάτων για συγκεκριμένο εύρος ημερομηνιών
const startDate = new Date('2025-10-01');
const endDate = new Date('2025-10-31');
const lessons = await getLessonsByDateRange(startDate, endDate);

// Ενημέρωση κατάστασης πληρωμής
await updateLessonPayment(newLesson.lesson_id, 'paid');
```

## Δομή Βάσης Δεδομένων

### Πίνακες

#### `students` (Μαθητές)
- `student_id`: Αυτόματος αύξων αριθμός (Primary Key)
- `onoma_mathiti`: Όνομα μαθητή (Υποχρεωτικό)
- `epitheto_mathiti`: Επώνυμο μαθητή
- `etos_gennisis`: Έτος γέννησης
- `onoma_gonea`: Όνομα γονέα
- `epitheto_gonea`: Επώνυμο γονέα
- `kinhto_tilefono`: Κινητό τηλέφωνο (Υποχρεωτικό)
- `email`: Email
- `megethos_violiou`: Μέγεθος βιολιού (π.χ. "4/4", "1/2")
- `default_diarkeia`: Προεπιλεγμένη διάρκεια μαθήματος (default: 40 λεπτά)
- `default_timi`: Προεπιλεγμένη τιμή μαθήματος
- `simiwseis`: Σημειώσεις
- `created_at`: Ημερομηνία δημιουργίας

#### `lessons` (Μαθήματα)
- `lesson_id`: Αυτόματος αύξων αριθμός (Primary Key)
- `student_id`: Foreign Key προς students
- `imera_ora_enarksis`: Ημερομηνία και ώρα έναρξης (Υποχρεωτικό)
- `diarkeia_lepta`: Διάρκεια σε λεπτά (Υποχρεωτικό)
- `timi`: Τιμή (Υποχρεωτικό)
- `katastasi_pliromis`: Κατάσταση πληρωμής ('pending', 'paid', 'cancelled')
- `simiwseis_mathimatos`: Σημειώσεις μαθήματος

#### `recurring_lessons` (Επαναλαμβανόμενα Μαθήματα)
- `recurring_id`: Αυτόματος αύξων αριθμός (Primary Key)
- `student_id`: Foreign Key προς students
- `imera_evdomadas`: Ημέρα εβδομάδας (0-6, 0=Κυριακή, 6=Σάββατο)
- `ora_enarksis`: Ώρα έναρξης (π.χ. '17:00')
- `diarkeia_lepta`: Διάρκεια σε λεπτά
- `timi`: Τιμή
- `enarxi_epanallipsis`: Ημερομηνία έναρξης επανάληψης
- `lixi_epanallipsis`: Ημερομηνία λήξης επανάληψης

## API Functions

### Μαθητές
- `getStudents()`: Λήψη όλων των μαθητών
- `getStudentById(studentId)`: Λήψη συγκεκριμένου μαθητή
- `addStudent(studentData)`: Προσθήκη νέου μαθητή
- `updateStudent(studentId, updates)`: Ενημέρωση μαθητή
- `deleteStudent(studentId)`: Διαγραφή μαθητή

### Μαθήματα
- `getLessonsByDateRange(startDate, endDate)`: Λήψη μαθημάτων ανά εύρος ημερομηνιών
- `getLessonsByStudent(studentId)`: Λήψη μαθημάτων συγκεκριμένου μαθητή
- `getLessonsByPaymentStatus(status)`: Λήψη μαθημάτων ανά κατάσταση πληρωμής
- `addLesson(lessonData)`: Προσθήκη νέου μαθήματος
- `updateLessonPayment(lessonId, newStatus)`: Ενημέρωση κατάστασης πληρωμής
- `deleteLesson(lessonId)`: Διαγραφή μαθήματος

### Επαναλαμβανόμενα Μαθήματα
- `getRecurringLessons()`: Λήψη όλων των κανόνων επανάληψης
- `addRecurringLesson(recurringData)`: Προσθήκη νέου κανόνα επανάληψης
- `deleteRecurringLesson(recurringId)`: Διαγραφή κανόνα επανάληψης

## Ασφάλεια

Για την προστασία της εφαρμογής:

1. **Row Level Security (RLS)**: Ενεργοποιήστε το RLS στο Supabase για κάθε πίνακα
2. **Authentication**: Χρησιμοποιήστε το Supabase Auth για είσοδο χρηστών
3. **Environment Variables**: Μην κάνετε commit τα credentials σας στο Git

### Παράδειγμα RLS Policy (Supabase)

```sql
-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_lessons ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read access" ON students
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON lessons
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON recurring_lessons
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated write access" ON students
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated write access" ON lessons
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated write access" ON recurring_lessons
  FOR ALL TO authenticated USING (true);
```

## Επόμενα Βήματα

1. Δημιουργήστε React Native εφαρμογή με βάση το Argon React Native template
2. Ενσωματώστε το `supabaseService.js`
3. Δημιουργήστε components για:
   - Λίστα μαθητών
   - Ημερολόγιο μαθημάτων
   - Φόρμα προσθήκης/επεξεργασίας μαθητή
   - Φόρμα προσθήκης/επεξεργασίας μαθήματος
   - Προβολή μαθημάτων ανά ημέρα
4. Ενσωματώστε το Supabase Authentication για login

## Άδεια

Αυτό το project δημιουργήθηκε για εκπαιδευτικούς σκοπούς.