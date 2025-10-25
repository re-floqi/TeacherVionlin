# Γρήγορος Οδηγός Χρήσης

## Πρώτα Βήματα (5 λεπτά)

### 1. Εγκατάσταση
```bash
# Clone το repository
git clone https://github.com/re-floqi/TeacherVionlin.git
cd TeacherVionlin

# Εγκατάσταση dependencies
npm install

# Δημιουργία .env αρχείου
cp .env.example .env
# Επεξεργαστείτε το .env με τα Supabase credentials σας
```

### 2. Ρύθμιση Supabase (10 λεπτά)
1. Δημιουργία λογαριασμού στο https://supabase.com
2. Δημιουργία νέου project
3. SQL Editor → Εκτέλεση του `database_schema.sql`
4. Settings → API → Αντιγραφή URL και anon key στο .env
5. Authentication → Users → Δημιουργία χρήστη

### 3. Εκκίνηση
```bash
npm start
```
Σκανάρετε το QR code με το Expo Go app!

## Βασικές Λειτουργίες

### Προσθήκη Μαθητή
```
1. Μαθητές → + Νέος Μαθητής
2. Συμπληρώστε: Όνομα*, Τηλέφωνο*
3. (Προαιρετικά) Γονέας, Email, Μέγεθος βιολιού
4. Ορίστε προεπιλεγμένη διάρκεια και τιμή
5. Προσθήκη Μαθητή
```

### Προγραμματισμός Μαθήματος
```
1. Αρχική → Επιλογή ημερομηνίας
2. + Νέο
3. Επιλέξτε μαθητή
4. Ορίστε ώρα, διάρκεια, τιμή
5. Προσθήκη Μαθήματος
```

### Σημείωση Πληρωμής
```
1. Πατήστε στο μάθημα
2. Αλλάξτε κατάσταση σε "Πληρώθηκε"
3. Ενημέρωση Μαθήματος
```

### Επαναλαμβανόμενα Μαθήματα
```
1. Αρχική → 🔄 Επαναλ.
2. Δείτε τα τακτικά μαθήματα
3. Κρατήστε πατημένο για διαγραφή
```

### Στατιστικά
```
1. Αρχική → 💰 Στατ.
2. Επιλέξτε περίοδο (Μήνας/Έτος/Όλα)
3. Δείτε έσοδα, εκκρεμείς πληρωμές
```

## Χρήσιμα Commands

```bash
# Εκκίνηση με clear cache
npm start -- --clear

# Εκκίνηση σε web browser
npm start
# Πατήστε 'w'

# Εκκίνηση σε Android emulator
npm start
# Πατήστε 'a'

# Εκκίνηση σε iOS simulator (Mac only)
npm start
# Πατήστε 'i'
```

## Συντομεύσεις Πληκτρολογίου (Terminal)

- `r` - Reload app
- `m` - Toggle menu
- `d` - Open DevTools
- `shift+d` - Open React DevTools
- `w` - Open in web browser
- `a` - Open in Android emulator
- `i` - Open in iOS simulator
- `c` - Clear console

## Δομή Αρχείων

```
TeacherVionlin/
├── App.js                    # Κύριο αρχείο εφαρμογής
├── supabaseService.js        # Database functions
├── database_schema.sql       # SQL schema
├── screens/                  # Όλες οι οθόνες
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── StudentsScreen.js
│   ├── AddEditStudentScreen.js
│   ├── AddEditLessonScreen.js
│   ├── RecurringLessonsScreen.js
│   └── PaymentStatsScreen.js
├── assets/                   # Icons, images
├── .env                      # Environment variables (δημιουργήστε το)
├── package.json              # Dependencies
└── README.md                 # Πλήρης τεκμηρίωση
```

## Συχνά Προβλήματα & Λύσεις

### "Cannot connect to Metro"
```bash
# Σιγουρευτείτε ότι είστε στο ίδιο Wi-Fi
# Επανεκκινήστε το Metro bundler
npm start -- --clear
```

### "Sign in error"
```bash
# Ελέγξτε το .env
# Επανεκκινήστε την εφαρμογή
# Press 'r' στο terminal
```

### "Module not found"
```bash
rm -rf node_modules
npm install
npm start
```

### Expo Cache Issues
```bash
expo start -c
```

## Tips & Tricks

### 🎯 Γρήγορη Πρόσβαση
- Swipe για να δείτε περισσότερες λεπτομέρειες
- Long press για διαγραφή
- Pull down για refresh

### 💡 Workflow Suggestions
1. **Αρχή εβδομάδας**: Ελέγξτε επερχόμενα μαθήματα
2. **Μετά το μάθημα**: Προσθέστε σημειώσεις
3. **Τέλος εβδομάδας**: Ενημερώστε πληρωμές
4. **Τέλος μήνα**: Δείτε στατιστικά

### 🔒 Ασφάλεια
- Μην share το .env αρχείο
- Χρησιμοποιήστε ισχυρό password
- Κάντε regular backups στο Supabase

### 📱 Mobile Tips
- Χρησιμοποιήστε το Expo Go για development
- Για production, κάντε standalone build
- Test σε πραγματική συσκευή, όχι μόνο emulator

## Quick Reference: Database Fields

### Students
```javascript
{
  onoma_mathiti: "Όνομα*",
  epitheto_mathiti: "Επώνυμο",
  kinhto_tilefono: "Τηλέφωνο*",
  etos_gennisis: 2015,
  onoma_gonea: "Όνομα γονέα",
  email: "email@example.com",
  megethos_violiou: "1/4",
  default_diarkeia: 40,
  default_timi: 20.00,
  simiwseis: "Σημειώσεις"
}
```

### Lessons
```javascript
{
  student_id: 1,
  imera_ora_enarksis: "2024-01-20T17:00:00Z",
  diarkeia_lepta: 40,
  timi: 20.00,
  katastasi_pliromis: "pending", // "paid", "cancelled"
  simiwseis_mathimatos: "Σημειώσεις"
}
```

### Payment Status Values
- `pending` - Εκκρεμεί
- `paid` - Πληρώθηκε
- `cancelled` - Ακυρώθηκε

## Επόμενα Βήματα

1. ✅ Εξοικειωθείτε με το UI
2. ✅ Προσθέστε 2-3 μαθητές δοκιμής
3. ✅ Δημιουργήστε μερικά μαθήματα
4. ✅ Δοκιμάστε τα στατιστικά
5. ✅ Εξερευνήστε όλες τις λειτουργίες
6. 🚀 Ξεκινήστε να το χρησιμοποιείτε πραγματικά!

## Υποστήριξη

- 📖 Πλήρης τεκμηρίωση: README.md
- 🔧 Οδηγός εγκατάστασης: SETUP_GUIDE.md
- 💻 API Reference: API_DOCUMENTATION.md
- ❓ Ερωτήσεις: FAQ.md
- 🐛 Issues: GitHub repository

## Links

- Supabase: https://supabase.com
- Expo: https://expo.dev
- React Native: https://reactnative.dev
- React Navigation: https://reactnavigation.org

---

**Καλή χρήση! 🎻**
