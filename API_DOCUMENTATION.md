# API Documentation - supabaseService.js

## Περιγραφή

Το αρχείο `supabaseService.js` παρέχει όλες τις συναρτήσεις για την επικοινωνία με τη βάση δεδομένων Supabase. Όλες οι συναρτήσεις είναι asynchronous και επιστρέφουν αντικείμενα με τη μορφή:

```javascript
{
  success: true/false,
  data: <δεδομένα> ή null,
  error: <μήνυμα σφάλματος> (μόνο σε περίπτωση αποτυχίας)
}
```

## Authentication Functions

### signIn(email, password)
Συνδέει χρήστη με email και password.

**Παράμετροι:**
- `email` (string): Email του χρήστη
- `password` (string): Password του χρήστη

**Επιστρέφει:**
```javascript
{
  success: true,
  data: {
    user: {...},
    session: {...}
  }
}
```

**Παράδειγμα:**
```javascript
const result = await signIn('user@example.com', 'password123');
if (result.success) {
  console.log('Επιτυχής σύνδεση:', result.data.user);
}
```

### signOut()
Αποσυνδέει τον τρέχοντα χρήστη.

**Επιστρέφει:**
```javascript
{
  success: true
}
```

**Παράδειγμα:**
```javascript
await signOut();
```

### getCurrentSession()
Επιστρέφει την τρέχουσα session του χρήστη.

**Επιστρέφει:**
```javascript
{
  user: {...},
  access_token: '...'
}
// ή null αν δεν υπάρχει session
```

## Student Management Functions

### getStudents()
Φέρνει όλους τους μαθητές, ταξινομημένους αλφαβητικά κατά επώνυμο.

**Επιστρέφει:**
```javascript
{
  success: true,
  data: [
    {
      student_id: 1,
      onoma_mathiti: 'Γιώργος',
      epitheto_mathiti: 'Παπαδόπουλος',
      etos_gennisis: 2015,
      onoma_gonea: 'Μαρία',
      epitheto_gonea: 'Παπαδοπούλου',
      kinhto_tilefono: '6912345678',
      email: 'maria@example.com',
      megethos_violiou: '1/4',
      default_diarkeia: 40,
      default_timi: 20.00,
      simiwseis: 'Σημειώσεις...',
      created_at: '2024-01-01T10:00:00Z'
    },
    ...
  ]
}
```

**Παράδειγμα:**
```javascript
const result = await getStudents();
if (result.success) {
  console.log(`Βρέθηκαν ${result.data.length} μαθητές`);
}
```

### getStudentById(studentId)
Φέρνει έναν συγκεκριμένο μαθητή με βάση το ID.

**Παράμετροι:**
- `studentId` (number): Το ID του μαθητή

**Επιστρέφει:**
```javascript
{
  success: true,
  data: { student_id: 1, onoma_mathiti: '...', ... }
}
```

### addStudent(studentData)
Προσθέτει νέο μαθητή.

**Παράμετροι:**
- `studentData` (object): Αντικείμενο με τα στοιχεία του μαθητή

**Απαιτούμενα πεδία:**
- `onoma_mathiti` (string)
- `kinhto_tilefono` (string)

**Προαιρετικά πεδία:**
- `epitheto_mathiti` (string)
- `etos_gennisis` (number)
- `onoma_gonea` (string)
- `epitheto_gonea` (string)
- `email` (string)
- `megethos_violiou` (string)
- `default_diarkeia` (number, default: 40)
- `default_timi` (number)
- `simiwseis` (string)

**Παράδειγμα:**
```javascript
const newStudent = {
  onoma_mathiti: 'Ελένη',
  epitheto_mathiti: 'Ιωάννου',
  kinhto_tilefono: '6987654321',
  default_diarkeia: 45,
  default_timi: 25.00
};

const result = await addStudent(newStudent);
if (result.success) {
  console.log('Προστέθηκε μαθητής με ID:', result.data.student_id);
}
```

### updateStudent(studentId, studentData)
Ενημερώνει τα στοιχεία ενός μαθητή.

**Παράμετροι:**
- `studentId` (number): Το ID του μαθητή
- `studentData` (object): Αντικείμενο με τα νέα στοιχεία

**Παράδειγμα:**
```javascript
const result = await updateStudent(1, {
  kinhto_tilefono: '6999999999',
  default_timi: 22.00
});
```

### deleteStudent(studentId)
Διαγράφει έναν μαθητή και όλα τα σχετικά μαθήματα (CASCADE).

**Παράμετροι:**
- `studentId` (number): Το ID του μαθητή

**Παράδειγμα:**
```javascript
const result = await deleteStudent(1);
if (result.success) {
  console.log('Ο μαθητής διαγράφηκε');
}
```

## Lesson Management Functions

### getLessonsByDateRange(startDate, endDate)
Φέρνει μαθήματα για ένα εύρος ημερομηνιών.

**Παράμετροι:**
- `startDate` (string): Ημερομηνία έναρξης σε ISO format
- `endDate` (string): Ημερομηνία λήξης σε ISO format

**Επιστρέφει:**
```javascript
{
  success: true,
  data: [
    {
      lesson_id: 1,
      student_id: 1,
      imera_ora_enarksis: '2024-01-15T17:00:00Z',
      diarkeia_lepta: 40,
      timi: 20.00,
      katastasi_pliromis: 'pending',
      simiwseis_mathimatos: 'Σημειώσεις...',
      students: {
        student_id: 1,
        onoma_mathiti: 'Γιώργος',
        epitheto_mathiti: 'Παπαδόπουλος',
        kinhto_tilefono: '6912345678'
      }
    },
    ...
  ]
}
```

**Παράδειγμα:**
```javascript
const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

const result = await getLessonsByDateRange(
  today.toISOString(),
  nextWeek.toISOString()
);
```

### getLessonsByStudent(studentId)
Φέρνει όλα τα μαθήματα ενός συγκεκριμένου μαθητή.

**Παράμετροι:**
- `studentId` (number): Το ID του μαθητή

**Επιστρέφει:** Πίνακα με μαθήματα, ταξινομημένα από το πιο πρόσφατο

### addLesson(lessonData)
Προσθέτει νέο μάθημα.

**Παράμετροι:**
- `lessonData` (object): Αντικείμενο με τα στοιχεία του μαθήματος

**Απαιτούμενα πεδία:**
- `student_id` (number)
- `imera_ora_enarksis` (string, ISO datetime)
- `diarkeia_lepta` (number)
- `timi` (number)

**Προαιρετικά πεδία:**
- `katastasi_pliromis` (string: 'pending', 'paid', 'cancelled', default: 'pending')
- `simiwseis_mathimatos` (string)

**Παράδειγμα:**
```javascript
const newLesson = {
  student_id: 1,
  imera_ora_enarksis: '2024-01-20T17:00:00Z',
  diarkeia_lepta: 40,
  timi: 20.00,
  katastasi_pliromis: 'pending'
};

const result = await addLesson(newLesson);
```

### updateLesson(lessonId, lessonData)
Ενημερώνει τα στοιχεία ενός μαθήματος.

**Παράμετροι:**
- `lessonId` (number): Το ID του μαθήματος
- `lessonData` (object): Αντικείμενο με τα νέα στοιχεία

### updateLessonPayment(lessonId, newStatus)
Ενημερώνει μόνο την κατάσταση πληρωμής ενός μαθήματος.

**Παράμετροι:**
- `lessonId` (number): Το ID του μαθήματος
- `newStatus` (string): 'pending', 'paid', ή 'cancelled'

**Παράδειγμα:**
```javascript
// Σημείωση πληρωμής
await updateLessonPayment(5, 'paid');
```

### deleteLesson(lessonId)
Διαγράφει ένα μάθημα.

**Παράμετροι:**
- `lessonId` (number): Το ID του μαθήματος

## Recurring Lesson Functions

### getRecurringLessons()
Φέρνει όλους τους κανόνες επαναλαμβανόμενων μαθημάτων.

**Επιστρέφει:**
```javascript
{
  success: true,
  data: [
    {
      recurring_id: 1,
      student_id: 1,
      imera_evdomadas: 1, // 0=Κυριακή, 1=Δευτέρα, κτλ.
      ora_enarksis: '17:00',
      diarkeia_lepta: 40,
      timi: 20.00,
      enarxi_epanallipsis: '2024-09-01',
      lixi_epanallipsis: '2025-06-30',
      students: {
        student_id: 1,
        onoma_mathiti: '...',
        epitheto_mathiti: '...',
        kinhto_tilefono: '...'
      }
    },
    ...
  ]
}
```

### getRecurringLessonsByStudent(studentId)
Φέρνει τους κανόνες επανάληψης για έναν συγκεκριμένο μαθητή.

**Παράμετροι:**
- `studentId` (number): Το ID του μαθητή

### addRecurringLesson(recurringData)
Προσθέτει νέο κανόνα επανάληψης.

**Παράμετροι:**
- `recurringData` (object): Αντικείμενο με τα στοιχεία του κανόνα

**Απαιτούμενα πεδία:**
- `student_id` (number)
- `imera_evdomadas` (number, 0-6)
- `ora_enarksis` (string, HH:MM format)
- `diarkeia_lepta` (number)
- `timi` (number)
- `enarxi_epanallipsis` (string, YYYY-MM-DD)

**Προαιρετικά πεδία:**
- `lixi_epanallipsis` (string, YYYY-MM-DD)

**Παράδειγμα:**
```javascript
const recurringRule = {
  student_id: 1,
  imera_evdomadas: 2, // Τρίτη
  ora_enarksis: '17:30',
  diarkeia_lepta: 45,
  timi: 25.00,
  enarxi_epanallipsis: '2024-09-01',
  lixi_epanallipsis: '2025-06-30'
};

const result = await addRecurringLesson(recurringRule);
```

### updateRecurringLesson(recurringId, recurringData)
Ενημερώνει έναν κανόνα επανάληψης.

**Παράμετροι:**
- `recurringId` (number): Το ID του κανόνα
- `recurringData` (object): Αντικείμενο με τα νέα στοιχεία

### deleteRecurringLesson(recurringId)
Διαγράφει έναν κανόνα επανάληψης.

**Παράμετροι:**
- `recurringId` (number): Το ID του κανόνα

## Utility Functions

### getPaymentStatistics(startDate, endDate)
Υπολογίζει στατιστικά πληρωμών για ένα εύρος ημερομηνιών.

**Παράμετροι:**
- `startDate` (string): Ημερομηνία έναρξης σε ISO format
- `endDate` (string): Ημερομηνία λήξης σε ISO format

**Επιστρέφει:**
```javascript
{
  success: true,
  data: {
    total: 10,              // Συνολικός αριθμός μαθημάτων
    paid: 7,                // Πληρωμένα μαθήματα
    pending: 2,             // Εκκρεμή μαθήματα
    cancelled: 1,           // Ακυρωμένα μαθήματα
    totalAmount: 200.00,    // Συνολικό ποσό
    paidAmount: 140.00,     // Πληρωμένο ποσό
    pendingAmount: 40.00    // Εκκρεμές ποσό
  }
}
```

**Παράδειγμα:**
```javascript
// Στατιστικά για τον τρέχοντα μήνα
const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const result = await getPaymentStatistics(
  firstDay.toISOString(),
  lastDay.toISOString()
);

console.log(`Συνολικά έσοδα: ${result.data.totalAmount}€`);
console.log(`Εκκρεμή: ${result.data.pendingAmount}€`);
```

### generateLessonsFromRecurring(recurringId, startDate, endDate)
Δημιουργεί αυτόματα μεμονωμένα μαθήματα από έναν κανόνα επανάληψης για ένα εύρος ημερομηνιών.

**Παράμετροι:**
- `recurringId` (number): Το ID του κανόνα επανάληψης
- `startDate` (string): Ημερομηνία έναρξης σε ISO format
- `endDate` (string): Ημερομηνία λήξης σε ISO format

**Επιστρέφει:**
```javascript
{
  success: true,
  data: [...], // Πίνακας με τα δημιουργημένα μαθήματα
  count: 10    // Αριθμός μαθημάτων που δημιουργήθηκαν
}
```

**Παράδειγμα:**
```javascript
// Δημιουργία μαθημάτων για τον επόμενο μήνα
const today = new Date();
const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

const result = await generateLessonsFromRecurring(
  1, // recurring_id
  today.toISOString(),
  nextMonth.toISOString()
);

console.log(`Δημιουργήθηκαν ${result.count} μαθήματα`);
```

## Student Progress Functions

### getStudentProgress(studentId)
Φέρνει όλες τις καταχωρήσεις προόδου για έναν μαθητή.

**Παράμετροι:**
- `studentId` (number): ID του μαθητή

**Επιστρέφει:**
```javascript
{
  success: true,
  data: [
    {
      progress_id: 1,
      student_id: 1,
      imera_kataxorisis: '2024-01-20T10:00:00Z',
      perigrafi: 'Learned new technique',
      skill_level: 4,
      kommati_mousikis: 'Vivaldi - Spring',
      simiwseis: 'Great improvement',
      created_by: 'Teacher Name'
    },
    ...
  ]
}
```

### addStudentProgress(progressData)
Προσθέτει νέα καταχώρηση προόδου για μαθητή.

**Παράμετροι:**
- `progressData` (object): Δεδομένα προόδου
  - `student_id` (number, required)
  - `perigrafi` (string, required): Περιγραφή προόδου
  - `skill_level` (number, optional): Επίπεδο δεξιοτήτων (1-5)
  - `kommati_mousikis` (string, optional): Κομμάτι μουσικής
  - `simiwseis` (string, optional): Σημειώσεις
  - `created_by` (string, optional): Όνομα δασκάλου

**Επιστρέφει:**
```javascript
{
  success: true,
  data: { progress_id: 1, ... }
}
```

**Παράδειγμα:**
```javascript
const result = await addStudentProgress({
  student_id: 1,
  perigrafi: 'Mastered vibrato technique',
  skill_level: 4,
  kommati_mousikis: 'Bach - Partita No.2',
  simiwseis: 'Excellent progress this week',
  created_by: 'Maria Papadopoulou'
});
```

### updateStudentProgress(progressId, progressData)
Ενημερώνει υπάρχουσα καταχώρηση προόδου.

**Παράμετροι:**
- `progressId` (number): ID της καταχώρησης προόδου
- `progressData` (object): Δεδομένα για ενημέρωση (ίδια με addStudentProgress)

**Επιστρέφει:**
```javascript
{
  success: true,
  data: { progress_id: 1, ... }
}
```

### deleteStudentProgress(progressId)
Διαγράφει μια καταχώρηση προόδου.

**Παράμετροι:**
- `progressId` (number): ID της καταχώρησης προόδου

**Επιστρέφει:**
```javascript
{
  success: true
}
```

---

## Error Handling

Όλες οι συναρτήσεις χειρίζονται errors και επιστρέφουν:

```javascript
{
  success: false,
  error: 'Μήνυμα σφάλματος',
  data: null ή []
}
```

**Παράδειγμα χρήσης:**
```javascript
const result = await getStudents();

if (result.success) {
  // Επεξεργασία δεδομένων
  console.log(result.data);
} else {
  // Χειρισμός σφάλματος
  console.error('Σφάλμα:', result.error);
  Alert.alert('Σφάλμα', result.error);
}
```

## Best Practices

1. **Πάντα να ελέγχετε το `success` flag πριν χρησιμοποιήσετε τα δεδομένα**
2. **Χρησιμοποιήστε try-catch για επιπλέον ασφάλεια**
3. **Validate τα δεδομένα πριν τα στείλετε στη βάση**
4. **Χρησιμοποιήστε ISO format για ημερομηνίες**
5. **Κρατήστε τα SUPABASE credentials ασφαλή στο .env αρχείο**

## Παραδείγματα Workflow

### Προσθήκη Μαθητή και Μαθήματος
```javascript
// 1. Προσθήκη μαθητή
const studentResult = await addStudent({
  onoma_mathiti: 'Νίκος',
  epitheto_mathiti: 'Γεωργίου',
  kinhto_tilefono: '6911111111',
  default_diarkeia: 40,
  default_timi: 20.00
});

if (studentResult.success) {
  const studentId = studentResult.data.student_id;
  
  // 2. Προσθήκη μαθήματος
  const lessonResult = await addLesson({
    student_id: studentId,
    imera_ora_enarksis: new Date('2024-01-20T17:00:00').toISOString(),
    diarkeia_lepta: 40,
    timi: 20.00
  });
  
  if (lessonResult.success) {
    console.log('Μαθητής και μάθημα προστέθηκαν επιτυχώς!');
  }
}
```

### Ενημέρωση Πληρωμών
```javascript
// Λήψη εκκρεμών μαθημάτων
const today = new Date();
const result = await getLessonsByDateRange(
  new Date(2024, 0, 1).toISOString(),
  today.toISOString()
);

if (result.success) {
  const pendingLessons = result.data.filter(
    lesson => lesson.katastasi_pliromis === 'pending'
  );
  
  // Ενημέρωση όλων σε "paid"
  for (const lesson of pendingLessons) {
    await updateLessonPayment(lesson.lesson_id, 'paid');
  }
}
```
