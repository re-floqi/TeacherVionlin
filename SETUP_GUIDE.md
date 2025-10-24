# Οδηγός Εγκατάστασης και Ρύθμισης

## Περιεχόμενα
1. [Προαπαιτούμενα](#προαπαιτούμενα)
2. [Ρύθμιση Supabase](#ρύθμιση-supabase)
3. [Ρύθμιση Authentication](#ρύθμιση-authentication)
4. [Ενσωμάτωση στο React Native](#ενσωμάτωση-στο-react-native)
5. [Χρήσιμες Συμβουλές](#χρήσιμες-συμβουλές)

---

## Προαπαιτούμενα

- Λογαριασμός στο [Supabase](https://supabase.com/)
- Node.js και npm εγκατεστημένα
- Βασικές γνώσεις React/React Native

---

## Ρύθμιση Supabase

### Βήμα 1: Δημιουργία Project

1. Συνδεθείτε στο [Supabase Dashboard](https://app.supabase.com/)
2. Κάντε κλικ στο "New Project"
3. Συμπληρώστε:
   - **Project Name**: TeacherVionlin (ή όνομα της επιλογής σας)
   - **Database Password**: Ένα ισχυρό password (αποθηκεύστε το σε ασφαλές μέρος)
   - **Region**: Επιλέξτε την πλησιέστερη περιοχή (π.χ. Frankfurt για Ελλάδα)
4. Κάντε κλικ στο "Create new project"
5. Περιμένετε 2-3 λεπτά για την ολοκλήρωση της δημιουργίας

### Βήμα 2: Εκτέλεση SQL Schema

1. Στο Supabase Dashboard, πηγαίνετε στο **SQL Editor** (αριστερό μενού)
2. Κάντε κλικ στο "+ New query"
3. Αντιγράψτε το περιεχόμενο του αρχείου `supabase-schema.sql`
4. Επικολλήστε το στο SQL Editor
5. Κάντε κλικ στο "Run" (ή πατήστε Ctrl/Cmd + Enter)
6. Θα πρέπει να δείτε το μήνυμα "Success. No rows returned"

### Βήμα 3: Επαλήθευση Δημιουργίας Πινάκων

1. Πηγαίνετε στο **Table Editor** (αριστερό μενού)
2. Θα πρέπει να βλέπετε τρεις πίνακες:
   - `students`
   - `lessons`
   - `recurring_lessons`
3. Κάντε κλικ σε κάθε πίνακα για να δείτε τη δομή του

### Βήμα 4: Λήψη Credentials

1. Πηγαίνετε στο **Settings** → **API** (αριστερό μενού)
2. Θα βρείτε:
   - **Project URL**: Κάτι σαν `https://xyzabc123.supabase.co`
   - **Project API keys**:
     - **anon/public**: Χρησιμοποιήστε αυτό το key (είναι ασφαλές για χρήση σε frontend)
     - **service_role**: ΜΗΝ το χρησιμοποιήσετε σε frontend (μόνο για backend)

---

## Ρύθμιση Authentication

### Row Level Security (RLS)

Για ασφάλεια, ενεργοποιήστε το Row Level Security:

```sql
-- Ενεργοποίηση RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_lessons ENABLE ROW LEVEL SECURITY;

-- Πολιτικές για authenticated χρήστες (μόνο εσείς)
CREATE POLICY "Allow authenticated read access" ON students
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write access" ON students
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON lessons
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write access" ON lessons
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON recurring_lessons
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write access" ON recurring_lessons
  FOR ALL TO authenticated USING (true);
```

### Ρύθμιση Email Authentication

1. Πηγαίνετε στο **Authentication** → **Providers**
2. Ενεργοποιήστε το **Email**
3. Επιλέξτε "Enable Email provider"
4. Αποθηκεύστε τις αλλαγές

### Δημιουργία Πρώτου Χρήστη

1. Πηγαίνετε στο **Authentication** → **Users**
2. Κάντε κλικ στο "Add user" → "Create new user"
3. Συμπληρώστε:
   - **Email**: Το email σας
   - **Password**: Ένα ισχυρό password
4. Κάντε κλικ στο "Create user"

---

## Ενσωμάτωση στο React Native

### Βήμα 1: Δημιουργία Αρχείου Περιβάλλοντος

Δημιουργήστε ένα αρχείο `.env` στο root του project:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**ΣΗΜΑΝΤΙΚΟ**: Προσθέστε το `.env` στο `.gitignore` για να μην ανεβεί στο Git!

### Βήμα 2: Εγκατάσταση Dependencies

```bash
npm install @supabase/supabase-js
```

Αν χρησιμοποιείτε React Native, χρειάζεστε επίσης:

```bash
npm install react-native-url-polyfill
```

### Βήμα 3: Αντιγραφή Αρχείων

Αντιγράψτε τα αρχεία:
- `supabaseService.js` → στον φάκελο `services/` ή `utils/` του project σας

### Βήμα 4: Χρήση του Service

```javascript
// App.js ή οποιοδήποτε component
import { getStudents, addStudent } from './services/supabaseService';

async function loadData() {
  try {
    const students = await getStudents();
    console.log('Students:', students);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Βήμα 5: Προσθήκη Login Screen

```javascript
import { supabase } from './services/supabaseService';

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Login error:', error);
    return;
  }
  
  console.log('Logged in successfully:', data.user);
}

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Logout error:', error);
}
```

---

## Χρήσιμες Συμβουλές

### 1. Debugging

Αν κάτι δεν λειτουργεί:
- Ελέγξτε το console για errors
- Επαληθεύστε ότι τα credentials στο `.env` είναι σωστά
- Ελέγξτε αν το RLS είναι σωστά ρυθμισμένο
- Ελέγξτε αν είστε logged in (για authenticated πολιτικές)

### 2. Δοκιμή API

Δοκιμάστε το API απευθείας από το Supabase:

1. Πηγαίνετε στο **API Docs**
2. Θα δείτε αυτόματα generated documentation
3. Μπορείτε να δοκιμάσετε queries απευθείας από εκεί

### 3. Backup

Κάντε regular backups:
1. Πηγαίνετε στο **Database** → **Backups**
2. Ενεργοποιήστε automatic backups
3. Κατεβάστε manual backups όποτε κάνετε σημαντικές αλλαγές

### 4. Monitoring

Παρακολουθήστε τη χρήση:
1. Πηγαίνετε στο **Settings** → **Usage**
2. Ελέγχετε:
   - Database size
   - API requests
   - Storage usage

### 5. Environment Variables σε Production

Για deployment (π.χ. Vercel, Netlify):

1. Προσθέστε τα environment variables στο dashboard του hosting provider
2. ΜΗΝ commit το `.env` file στο Git
3. Χρησιμοποιήστε `.env.example` ως template

---

## Επόμενα Βήματα

Μετά την ολοκλήρωση της ρύθμισης:

1. **Δημιουργήστε UI Components**:
   - Calendar view για προβολή μαθημάτων
   - Student list και detail screens
   - Lesson form για προσθήκη/επεξεργασία

2. **Προσθέστε Λειτουργίες**:
   - Push notifications για upcoming lessons
   - Export σε PDF για billing
   - Statistics και reports

3. **Βελτιώστε την Ασφάλεια**:
   - Προσθέστε email verification
   - Ενεργοποιήστε 2FA
   - Περιορίστε τα RLS policies ακόμα περισσότερο

4. **Deployment**:
   - Build το React Native app
   - Deploy σε App Store / Google Play
   - Ή χρησιμοποιήστε Expo για easier deployment

---

## Support

Αν αντιμετωπίσετε προβλήματα:

1. Ελέγξτε τα [Supabase Docs](https://supabase.com/docs)
2. Ελέγξτε τα examples στο αρχείο `examples.js`
3. Δείτε το [Supabase Discord](https://discord.supabase.com/) για support

---

## Χρήσιμα Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Argon React Native](https://demos.creative-tim.com/argon-react-native/)
