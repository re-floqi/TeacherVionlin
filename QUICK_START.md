# Γρήγορη Εκκίνηση / Quick Start Guide

## 🚀 5-Minute Setup

Για να ξεκινήσετε γρήγορα με την εφαρμογή:

### Βήμα 1: Supabase (2 λεπτά)
```bash
1. Πηγαίνετε στο https://supabase.com/
2. Sign up / Log in
3. Δημιουργήστε νέο project
4. Περιμένετε 2-3 λεπτά για την ολοκλήρωση
```

### Βήμα 2: Database Setup (1 λεπτό)
```bash
1. Ανοίξτε το SQL Editor στο Supabase Dashboard
2. Αντιγράψτε ΟΛΟ το περιεχόμενο του supabase-schema.sql
3. Επικολλήστε και πατήστε "Run"
4. Θα δείτε: "Success. No rows returned"
```

### Βήμα 3: Configuration (1 λεπτό)
```bash
# Αντιγράψτε το .env.example
cp .env.example .env

# Επεξεργαστείτε το .env με τα credentials από Supabase
# Settings → API → Project URL & anon key
nano .env
```

### Βήμα 4: Install & Test (1 λεπτό)
```bash
# Εγκατάσταση dependencies
npm install

# Δοκιμή (προαιρετικό)
node -e "console.log(require('./supabaseService.js'))"
```

✅ **Done!** Τώρα μπορείτε να χρησιμοποιήσετε το `supabaseService.js` στην εφαρμογή σας.

---

## 📝 Πρώτα Βήματα στον Κώδικα

### 1. Import το Service
```javascript
import {
  getStudents,
  addStudent,
  addLesson,
  getLessonsByDateRange
} from './supabaseService';
```

### 2. Προσθέστε τον Πρώτο Μαθητή
```javascript
const newStudent = await addStudent({
  onoma_mathiti: 'Μαρία',
  epitheto_mathiti: 'Παπαδοπούλου',
  kinhto_tilefono: '6912345678',
  default_diarkeia: 45,
  default_timi: 25.00
});

console.log('Created student:', newStudent.student_id);
```

### 3. Προγραμματίστε Μάθημα
```javascript
const lesson = await addLesson({
  student_id: newStudent.student_id,
  imera_ora_enarksis: new Date('2025-10-25T17:00:00'),
  diarkeia_lepta: 45,
  timi: 25.00
});

console.log('Lesson scheduled:', lesson.lesson_id);
```

### 4. Δείτε Μαθήματα Μήνα
```javascript
const start = new Date('2025-10-01');
const end = new Date('2025-10-31');
const lessons = await getLessonsByDateRange(start, end);

console.log(`Found ${lessons.length} lessons in October`);
```

---

## 🔐 Authentication Setup (Προαιρετικό αλλά Συνιστάται)

### Enable Authentication στο Supabase
```sql
-- Εκτελέστε στο SQL Editor
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_lessons ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users only
CREATE POLICY "Allow authenticated access" ON students
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated access" ON lessons
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated access" ON recurring_lessons
  FOR ALL TO authenticated USING (true);
```

### Δημιουργία Χρήστη
```
1. Πηγαίνετε στο Authentication → Users
2. Πατήστε "Add user" → "Create new user"
3. Βάλτε email και password
4. Πατήστε "Create user"
```

### Login στην Εφαρμογή
```javascript
import { supabase } from './supabaseService';

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    alert('Login failed: ' + error.message);
    return null;
  }
  
  alert('Logged in as: ' + data.user.email);
  return data.user;
}

// Χρήση
await login('your-email@example.com', 'your-password');
```

---

## 📱 React Native Integration

### Install Dependencies
```bash
npm install @supabase/supabase-js react-native-url-polyfill
```

### Setup Polyfill (App.js ή index.js)
```javascript
import 'react-native-url-polyfill/auto';
import { getStudents, addLesson } from './services/supabaseService';
```

### Example Component
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getStudents } from './services/supabaseService';

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.student_id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.onoma_mathiti} {item.epitheto_mathiti}</Text>
          <Text>{item.kinhto_tilefono}</Text>
        </View>
      )}
    />
  );
}

export default StudentsList;
```

---

## 🧪 Testing Your Setup

### Test 1: Check Database Connection
```javascript
import { supabase } from './supabaseService';

async function testConnection() {
  const { data, error } = await supabase
    .from('students')
    .select('count');
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connection successful!');
  }
}

testConnection();
```

### Test 2: CRUD Operations
```javascript
import { getStudents, addStudent, deleteStudent } from './supabaseService';

async function testCRUD() {
  console.log('Testing CRUD operations...\n');
  
  // Create
  console.log('1. Creating student...');
  const student = await addStudent({
    onoma_mathiti: 'Test',
    epitheto_mathiti: 'Student',
    kinhto_tilefono: '1234567890',
    default_diarkeia: 30,
    default_timi: 20.00
  });
  console.log('✅ Created:', student.student_id);
  
  // Read
  console.log('\n2. Reading students...');
  const students = await getStudents();
  console.log('✅ Found:', students.length, 'students');
  
  // Delete
  console.log('\n3. Deleting test student...');
  await deleteStudent(student.student_id);
  console.log('✅ Deleted');
  
  console.log('\n✅ All tests passed!');
}

testCRUD();
```

---

## 📚 Χρήσιμα Links

### Documentation
- [README.md](./README.md) - Πλήρης τεκμηρίωση στα ελληνικά
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Αναλυτικές οδηγίες εγκατάστασης
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Αρχιτεκτονική και διαγράμματα
- [examples.js](./examples.js) - Παραδείγματα κώδικα

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Argon React Native](https://demos.creative-tim.com/argon-react-native/)

---

## 🐛 Troubleshooting

### Πρόβλημα 1: "Invalid API key"
```
✗ Error: Invalid API key

✓ Fix:
1. Ελέγξτε το .env file
2. Βεβαιωθείτε ότι χρησιμοποιείτε το "anon" key (όχι "service_role")
3. Restart το app μετά την αλλαγή .env
```

### Πρόβλημα 2: "Relation does not exist"
```
✗ Error: relation "students" does not exist

✓ Fix:
1. Πηγαίνετε στο SQL Editor
2. Εκτελέστε το supabase-schema.sql
3. Ελέγξτε στο Table Editor αν υπάρχουν οι πίνακες
```

### Πρόβλημα 3: "No rows returned" (με RLS enabled)
```
✗ Error: No data returned (but records exist)

✓ Fix:
1. Ελέγξτε αν είστε logged in
2. Ελέγξτε τα RLS policies
3. Ή disable RLS προσωρινά για testing:
   ALTER TABLE students DISABLE ROW LEVEL SECURITY;
```

### Πρόβλημα 4: CORS Errors
```
✗ Error: CORS policy blocked

✓ Fix:
1. Πηγαίνετε στο Supabase → Settings → API
2. Προσθέστε το domain σας στο "CORS Allowed Origins"
3. Για local dev: http://localhost:3000
```

---

## 💡 Pro Tips

### Tip 1: Use React DevTools
```bash
npm install -g react-devtools
react-devtools
```

### Tip 2: Enable Supabase Logs
```javascript
// Δείτε όλα τα queries στο console
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key, {
  db: { schema: 'public' },
  auth: { persistSession: true },
  global: { 
    fetch: (...args) => {
      console.log('Supabase request:', args[0]);
      return fetch(...args);
    }
  }
});
```

### Tip 3: Database Backup
```bash
# Backup από Supabase Dashboard
Settings → Database → Backups → Download

# Ή με pg_dump (advanced)
pg_dump -h db.xxx.supabase.co -U postgres database_name > backup.sql
```

### Tip 4: Sample Data
```javascript
// Γρήγορη προσθήκη sample data
import { addStudent, addLesson } from './supabaseService';

async function addSampleData() {
  const students = [
    { onoma_mathiti: 'Μαρία', epitheto_mathiti: 'Κ.', kinhto_tilefono: '6911111111', default_diarkeia: 45, default_timi: 25 },
    { onoma_mathiti: 'Γιάννης', epitheto_mathiti: 'Π.', kinhto_tilefono: '6922222222', default_diarkeia: 40, default_timi: 20 },
    { onoma_mathiti: 'Ελένη', epitheto_mathiti: 'Α.', kinhto_tilefono: '6933333333', default_diarkeia: 45, default_timi: 25 }
  ];

  for (const student of students) {
    const s = await addStudent(student);
    console.log('Added:', s.onoma_mathiti);
    
    // Add a lesson
    await addLesson({
      student_id: s.student_id,
      imera_ora_enarksis: new Date('2025-10-25T17:00:00'),
      diarkeia_lepta: s.default_diarkeia,
      timi: s.default_timi
    });
  }
  
  console.log('✅ Sample data added!');
}

addSampleData();
```

---

## 🎯 Next Steps

Μετά την ολοκλήρωση του setup:

1. ✅ **Τεστάρετε τις βασικές λειτουργίες** (add/get students & lessons)
2. 🎨 **Δημιουργήστε το UI** με Argon React Native
3. 📅 **Προσθέστε Calendar component** (π.χ. react-native-calendars)
4. 🔔 **Προσθέστε notifications** για upcoming lessons
5. 📊 **Δημιουργήστε reports** για έσοδα και στατιστικά
6. 🚀 **Deploy** στο App Store / Google Play

---

## 📞 Support

Αν χρειάζεστε βοήθεια:
- Δείτε τα [examples.js](./examples.js) για παραδείγματα
- Διαβάστε το [SETUP_GUIDE.md](./SETUP_GUIDE.md) για λεπτομέρειες
- Ελέγξτε το [Supabase Discord](https://discord.supabase.com/)
- Δημιουργήστε issue στο GitHub

---

**Καλή επιτυχία με την εφαρμογή σας! 🎻🎵**
