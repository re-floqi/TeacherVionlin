# Αρχιτεκτονική Συστήματος / System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  TEACHER VIOLIN APPLICATION                      │
│                 (React Native με Argon Theme)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    supabaseService.js                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  JavaScript Service Layer                                 │  │
│  │  • Error Handling                                        │  │
│  │  • Type Conversion                                       │  │
│  │  • Data Validation                                       │  │
│  │  • 15 Async Functions                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ @supabase/supabase-js
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Authentication & Authorization                           │  │
│  │  • Email/Password Login                                  │  │
│  │  • Row Level Security (RLS)                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                      │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  ENUM: payment_status                               │ │  │
│  │  │  • pending                                          │ │  │
│  │  │  • paid                                             │ │  │
│  │  │  • cancelled                                        │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  TABLE: students                                    │ │  │
│  │  │  • student_id (PK)                                  │ │  │
│  │  │  • onoma_mathiti (required)                         │ │  │
│  │  │  • epitheto_mathiti                                 │ │  │
│  │  │  • etos_gennisis                                    │ │  │
│  │  │  • onoma_gonea                                      │ │  │
│  │  │  • epitheto_gonea                                   │ │  │
│  │  │  • kinhto_tilefono (required)                       │ │  │
│  │  │  • email                                            │ │  │
│  │  │  • megethos_violiou                                 │ │  │
│  │  │  • default_diarkeia (default: 40)                   │ │  │
│  │  │  • default_timi                                     │ │  │
│  │  │  • simiwseis                                        │ │  │
│  │  │  • created_at                                       │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                         │                                 │  │
│  │                         │ Foreign Key                     │  │
│  │                         ▼                                 │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  TABLE: lessons                                     │ │  │
│  │  │  • lesson_id (PK)                                   │ │  │
│  │  │  • student_id (FK) → students                       │ │  │
│  │  │  • imera_ora_enarksis (required)                    │ │  │
│  │  │  • diarkeia_lepta (required)                        │ │  │
│  │  │  • timi (required)                                  │ │  │
│  │  │  • katastasi_pliromis (default: pending)            │ │  │
│  │  │  • simiwseis_mathimatos                             │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                         │                                 │  │
│  │                         │ Foreign Key                     │  │
│  │                         ▼                                 │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  TABLE: recurring_lessons                           │ │  │
│  │  │  • recurring_id (PK)                                │ │  │
│  │  │  • student_id (FK) → students                       │ │  │
│  │  │  • imera_evdomadas (0-6)                            │ │  │
│  │  │  • ora_enarksis                                     │ │  │
│  │  │  • diarkeia_lepta                                   │ │  │
│  │  │  • timi                                             │ │  │
│  │  │  • enarxi_epanallipsis                              │ │  │
│  │  │  • lixi_epanallipsis                                │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow / Ροή Δεδομένων

### 1. Προσθήκη Μαθητή (Add Student)
```
React Component
    │
    │ addStudent({ onoma_mathiti, kinhto_tilefono, ... })
    ▼
supabaseService.js
    │
    │ INSERT INTO students
    ▼
Supabase/PostgreSQL
    │
    │ Return: { student_id, ... }
    ▼
React Component (Update UI)
```

### 2. Λήψη Μαθημάτων για Ημερολόγιο (Get Lessons for Calendar)
```
React Component (Calendar)
    │
    │ getLessonsByDateRange(startDate, endDate)
    ▼
supabaseService.js
    │
    │ SELECT * FROM lessons 
    │ JOIN students
    │ WHERE imera_ora_enarksis BETWEEN startDate AND endDate
    ▼
Supabase/PostgreSQL
    │
    │ Return: [{ lesson_id, student: {...}, ... }, ...]
    ▼
React Component (Display on Calendar)
```

### 3. Ενημέρωση Πληρωμής (Update Payment)
```
React Component (Lesson Detail)
    │
    │ updateLessonPayment(lesson_id, 'paid')
    ▼
supabaseService.js
    │
    │ Validate status ∈ {pending, paid, cancelled}
    │ UPDATE lessons SET katastasi_pliromis = 'paid'
    ▼
Supabase/PostgreSQL
    │
    │ Return: { lesson_id, katastasi_pliromis: 'paid', ... }
    ▼
React Component (Update UI)
```

## API Functions Overview / Επισκόπηση API Functions

### Students (Μαθητές)
| Function | Purpose | Returns |
|----------|---------|---------|
| `getStudents()` | Φέρνει όλους τους μαθητές | Array<Student> |
| `getStudentById(id)` | Φέρνει συγκεκριμένο μαθητή | Student |
| `addStudent(data)` | Προσθέτει μαθητή | Student |
| `updateStudent(id, data)` | Ενημερώνει μαθητή | Student |
| `deleteStudent(id)` | Διαγράφει μαθητή | Success message |

### Lessons (Μαθήματα)
| Function | Purpose | Returns |
|----------|---------|---------|
| `getLessonsByDateRange(start, end)` | Φέρνει μαθήματα ανά ημερομηνία | Array<Lesson> |
| `getLessonsByStudent(id)` | Φέρνει μαθήματα μαθητή | Array<Lesson> |
| `getLessonsByPaymentStatus(status)` | Φέρνει μαθήματα ανά status | Array<Lesson> |
| `addLesson(data)` | Προσθέτει μάθημα | Lesson |
| `updateLessonPayment(id, status)` | Ενημερώνει πληρωμή | Lesson |
| `deleteLesson(id)` | Διαγράφει μάθημα | Success message |

### Recurring Lessons (Επαναλαμβανόμενα)
| Function | Purpose | Returns |
|----------|---------|---------|
| `getRecurringLessons()` | Φέρνει κανόνες επανάληψης | Array<RecurringLesson> |
| `addRecurringLesson(data)` | Προσθέτει κανόνα | RecurringLesson |
| `deleteRecurringLesson(id)` | Διαγράφει κανόνα | Success message |

## Typical User Workflows / Τυπικά Σενάρια Χρήσης

### Workflow 1: Εγγραφή Νέου Μαθητή
1. Ο δάσκαλος ανοίγει τη φόρμα "Νέος Μαθητής"
2. Συμπληρώνει: όνομα, επώνυμο, τηλέφωνο, κλπ.
3. Ορίζει default διάρκεια (π.χ. 45 λεπτά) και τιμή (π.χ. €25)
4. Πατάει "Αποθήκευση"
5. → `addStudent()` → Δημιουργία στη βάση
6. Επιστροφή στη λίστα μαθητών

### Workflow 2: Προγραμματισμός Εβδομαδιαίου Μαθήματος
1. Επιλογή μαθητή από τη λίστα
2. Πατάει "Προσθήκη Επαναλαμβανόμενου Μαθήματος"
3. Επιλέγει: Τρίτη, 17:00, 45 λεπτά, €25
4. Ορίζει: 01/09/2025 - 30/06/2026
5. → `addRecurringLesson()` → Αποθήκευση κανόνα
6. Το σύστημα μπορεί να δημιουργήσει αυτόματα μαθήματα

### Workflow 3: Προβολή Ημερολογίου
1. Ανοίγει το ημερολόγιο
2. Επιλέγει Οκτώβριο 2025
3. → `getLessonsByDateRange('2025-10-01', '2025-10-31')`
4. Εμφανίζονται όλα τα μαθήματα του μήνα
5. Κάνει κλικ σε μία ημέρα
6. Βλέπει τα μαθήματα της ημέρας με λεπτομέρειες

### Workflow 4: Καταγραφή Πληρωμής
1. Βλέπει τη λίστα μαθημάτων με "pending" πληρωμές
2. → `getLessonsByPaymentStatus('pending')`
3. Επιλέγει μάθημα που πληρώθηκε
4. Πατάει "Σήμανση ως Πληρωμένο"
5. → `updateLessonPayment(lesson_id, 'paid')`
6. Το status αλλάζει σε "paid"

### Workflow 5: Μηνιαία Αναφορά
1. Ανοίγει την ενότητα "Αναφορές"
2. Επιλέγει μήνα: Οκτώβριος 2025
3. Το σύστημα φέρνει:
   - → `getLessonsByDateRange(startOfMonth, endOfMonth)`
   - Υπολογίζει συνολικά έσοδα από paid lessons
   - Υπολογίζει pending πληρωμές
4. Εμφανίζει στατιστικά και γραφήματα

## Security Considerations / Ζητήματα Ασφάλειας

```
┌─────────────────────────────────────┐
│    Public Access (Unauthenticated)  │
│              NO ACCESS              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Authenticated Users (Teachers)    │
│   ✓ Full CRUD on students          │
│   ✓ Full CRUD on lessons           │
│   ✓ Full CRUD on recurring_lessons │
└─────────────────────────────────────┘

Row Level Security (RLS) Policies:
• Όλοι οι πίνακες: Read/Write μόνο για authenticated
• Χρήση Supabase Auth για login
• Environment variables για credentials
• .gitignore για προστασία .env files
```

## Technology Stack / Τεχνολογίες

- **Frontend**: React Native με Argon Theme
- **Backend**: Supabase (PostgreSQL + REST API)
- **Authentication**: Supabase Auth (Email/Password)
- **Database**: PostgreSQL 15+
- **ORM/Client**: @supabase/supabase-js
- **State Management**: React Hooks (useState, useEffect)
- **Date Handling**: Native JavaScript Date objects

## Performance Considerations / Επιδόσεις

### Database Indexes
```sql
-- Γρήγορη αναζήτηση μαθημάτων ανά μαθητή
CREATE INDEX idx_lessons_student_id ON lessons(student_id);

-- Γρήγορη αναζήτηση μαθημάτων ανά ημερομηνία
CREATE INDEX idx_lessons_imera_ora_enarksis ON lessons(imera_ora_enarksis);

-- Γρήγορη αναζήτηση recurring rules
CREATE INDEX idx_recurring_lessons_student_id ON recurring_lessons(student_id);
CREATE INDEX idx_recurring_lessons_imera_evdomadas ON recurring_lessons(imera_evdomadas);
```

### Pagination
Για μεγάλο αριθμό εγγραφών, χρησιμοποιήστε pagination:
```javascript
const { data, error } = await supabase
  .from('lessons')
  .select('*')
  .range(0, 9); // First 10 records
```

### Caching
Για καλύτερη απόδοση, cache frequently accessed data:
- Students list
- Recurring lesson rules
- Current month's lessons
